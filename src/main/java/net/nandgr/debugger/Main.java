package net.nandgr.debugger;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.asm.json.Asm;
import net.nandgr.debugger.asm.json.Code;
import net.nandgr.debugger.asm.json.Contract;
import net.nandgr.debugger.cfg.CFGCreatorDefault;
import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.ContractBytecode;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.cfg.graphviz.GraphVizCreator;
import net.nandgr.debugger.trace.TraceService;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionLog;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionResponse;
import net.nandgr.eth.Disassembler;
import net.nandgr.eth.Opcode;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.rmi.server.ExportException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Main {

    public static void main(String[] args) throws Exception {

        String name = "Impl.sol";
        String code = "608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c045f2d1461005c57806367e0badb14610093578063cd16ecbf146100be575b600080fd5b34801561006857600080fd5b5061009160048036038101908080359060200190929190803590602001909291905050506100eb565b005b34801561009f57600080fd5b506100a86100fd565b6040518082815260200191505060405180910390f35b3480156100ca57600080fd5b506100e960048036038101908080359060200190929190505050610106565b005b81600081905550806001819055505050565b60008054905090565b80600081905550505600a165627a7a7230582039dcdb7685335c75b3515b47d970516fe695dfb1f28195e1909aaf4f869118550029";
        File asmFile = new File("asm.asm");

        byte[] bytes = Files.readAllBytes(asmFile.toPath());
        String asm = new String(bytes);

        ObjectMapper objectMapper = new ObjectMapper();
        Asm asmObject = objectMapper.readValue(asm, Asm.class);
        List<Code> asmCode = asmObject.getContracts().get("Impl.sol:Impl").getAsm().getData().get("0").getCode();

        asmCode.removeIf(elem -> elem.getName().equals("tag"));

        Disassembler disassembler = new Disassembler(code);

        List<Opcode> opcodes = disassembler.getOpcodes();

        if (opcodes.size()-1 != asmCode.size()) {
            // TODO move to a new exception somewhere
            throw new Exception("Asm does not match with bytecode. Opcodes size: " + opcodes.size() + ", asm size: " + asmCode.size());
        }

        List<OpcodeSource> opcodeSources = new ArrayList<>();
        for (int i = 0; i < asmCode.size(); i++) {
            OpcodeSource opcodeSource = new OpcodeSource(opcodes.get(i));
            Code currentAsmOpcode = asmCode.get(i);
            opcodeSource.setBegin(currentAsmOpcode.getBegin());
            opcodeSource.setEnd(currentAsmOpcode.getEnd());
            opcodeSources.add(opcodeSource);
        }

        CFGCreatorDefault cfgCreatorDefault = new CFGCreatorDefault();

        ContractBytecode contractBytecode = cfgCreatorDefault.createContractBytecode(opcodeSources);
        Map<Integer, BytecodeChunk> runtimeChunks = contractBytecode.getRuntime().getChunks();

        TraceService traceService = new TraceService("http://127.0.0.1:8545");
        Map<Integer, DebugTraceTransactionLog> traceData = traceService.getTraceData("0xc296ffe00b37d7740f22f2227f39b210a4928756f9472a37cab61951cf9fbffa");

        GraphVizCreator graphVizCreator = new GraphVizCreator(runtimeChunks, traceData);
        String graph = graphVizCreator.buildStringGraph();
        System.out.println(graph);

//        for (Map.Entry<Integer, BytecodeChunk> integerBytecodeChunkEntry : contractBytecode.getRuntime().getChunks().entrySet()) {
//            for (Opcode opcode : integerBytecodeChunkEntry.getValue().getOpcodes()) {
//                Integer key = integerBytecodeChunkEntry.getKey();
//                System.out.println(Integer.toHexString(key) + "-> " + opcode.toString());
//            }
//        }

//        for (OpcodeSource opcode : opcodeSources) {
//            System.out.println(opcode.toString());
//        }
    }
}
