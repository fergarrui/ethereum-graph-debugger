package net.nandgr.debugger.cfg;

import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.BytecodeSection;
import net.nandgr.debugger.cfg.beans.ContractBytecode;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.eth.Opcode;
import net.nandgr.eth.Opcodes;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CFGCreatorDefault {

    private final static List<Opcodes> endChunkOpcodes = Stream.of(
            Opcodes.JUMPI,
            Opcodes.JUMP,
            Opcodes.STOP,
            Opcodes.REVERT,
            Opcodes.RETURN
    ).collect(Collectors.toList());

    public ContractBytecode createContractBytecode(List<OpcodeSource> contractOpcodes) {
        BigInteger codeOffset = BigInteger.valueOf(0);
        BytecodeSection constructorSection = null;
        boolean constructorFound = false;
        int i = 0;
        for (; i < contractOpcodes.size() ; i++) {
            Opcode contractOpcode = contractOpcodes.get(i);
            if (contractOpcode.getOpcode().equals(Opcodes.CODECOPY)) {
                codeOffset = contractOpcodes.get(i-2).getParameter();
            }
            if (contractOpcode.getOffset() != 0 && contractOpcode.getOffset() == codeOffset.intValue()) {
                constructorFound = true;
                List<OpcodeSource> constructorOpcodes = contractOpcodes.subList(0, i);
                Map<Integer, BytecodeChunk> constructorChunks = splitInChunks(constructorOpcodes);
                createRelations(constructorChunks);
                constructorSection = new BytecodeSection(constructorChunks);
                break;
            }
        }
        if (!constructorFound) {
            i = 0;
        }
        List<OpcodeSource> functionsOpcodes = contractOpcodes.subList(i, contractOpcodes.size()-1);
        if (i != 0) {
            adjustOffsets(functionsOpcodes, codeOffset.intValue());
        }

        Map<Integer, BytecodeChunk> functionsChunks = splitInChunks(functionsOpcodes);
        createRelations(functionsChunks);
        BytecodeSection functionsSection = new BytecodeSection(functionsChunks);

        return new ContractBytecode(constructorSection, functionsSection);
    }

    private static void adjustOffsets(List<OpcodeSource> functionsOpcodes, int offset) {
        for (Opcode opcode : functionsOpcodes) {
            opcode.setOffset(opcode.getOffset() - offset);
        }
    }

    private Map<Integer, BytecodeChunk> splitInChunks(List<OpcodeSource> opcodes) {
        Map<Integer, BytecodeChunk> chunks = new HashMap<>();
        int startIndex = 0;
        for (int i = 0 ; i < opcodes.size() ; i++) {
            OpcodeSource opcode = opcodes.get(i);
            if (endChunkOpcodes.contains(opcode.getOpcode()) || opcodes.size()-1 == i) {
                BytecodeChunk bytecodeChunk = new BytecodeChunk(i);
                List<OpcodeSource> chunkOpcodes = opcodes.subList(startIndex, i + 1);
                bytecodeChunk.setOpcodes(chunkOpcodes);
                if (!chunkOpcodes.isEmpty()) {
                    Opcode jumpDest = getJumpDest(chunkOpcodes);
                    chunks.put(jumpDest.getOffset(), bytecodeChunk);
                }
                startIndex = i + 1;
            }
        }
        return chunks;
    }

    private Opcode getJumpDest(List<OpcodeSource> chunkOpcodes) {
        for (Opcode chunkOpcode : chunkOpcodes) {
            if (chunkOpcode.getOpcode().equals(Opcodes.JUMPDEST)) {
                return chunkOpcode;
            }
        }
        return chunkOpcodes.get(0);
    }

    private void createRelations(Map<Integer, BytecodeChunk> chunks) {
        for (Map.Entry<Integer, BytecodeChunk> chunkEntry : chunks.entrySet()) {
            BytecodeChunk chunk = chunkEntry.getValue();
            List<OpcodeSource> opcodes = chunk.getOpcodes();
            Opcode lastOpcode = opcodes.get(opcodes.size() - 1);
            Opcodes lastOpcodeDefinition = lastOpcode.getOpcode();
            if (lastOpcodeDefinition.equals(Opcodes.JUMPI) || lastOpcodeDefinition.equals(Opcodes.JUMP)) {
                Opcode previousOpcode = opcodes.get(opcodes.size() -2);
                if (Opcodes.isPush(previousOpcode.getOpcode())) {
                    BigInteger jumpLocation = previousOpcode.getParameter();
                    BytecodeChunk jumpToChunk = chunks.get(jumpLocation.intValue());
                    chunk.setBranchA(jumpToChunk);
                    // If it is not the last chunk
                    int nextKey = lastOpcode.getOffset() + 1;
                    if (lastOpcodeDefinition.equals(Opcodes.JUMPI) && chunks.containsKey(nextKey)) {
                        chunk.setBranchB(chunks.get(nextKey));
                    }
                }
            }
        }
    }
}
