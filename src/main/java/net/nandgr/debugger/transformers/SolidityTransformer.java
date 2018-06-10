package net.nandgr.debugger.transformers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.cfg.CFGCreatorDefault;
import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.ContractBytecode;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.cfg.graphviz.GraphVizCreator;
import net.nandgr.debugger.disassembler.DisassemblerException;
import net.nandgr.debugger.disassembler.LinkedDisassembler;
import net.nandgr.debugger.node.NodeService;
import net.nandgr.debugger.node.response.json.DebugTraceTransactionLog;
import net.nandgr.debugger.node.response.json.GetCodeResponse;
import net.nandgr.debugger.solc.Solc;
import net.nandgr.debugger.solc.solcjson.Code;
import net.nandgr.debugger.solc.solcjson.Contract;
import net.nandgr.debugger.solc.solcjson.SolcOutput;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SolidityTransformer implements Transformer {

    private final String nodeUrl;
    private final String txHash;

    public SolidityTransformer(String nodeUrl, String txHash) {
        this.nodeUrl = nodeUrl;
        this.txHash = txHash;
        if (!Solc.checkSolcInClasspath()) {
            System.out.println("solc was not found in classpath");
            System.exit(0);
        }
    }

    @Override
    public List<ContractObject> loadContracts(String sourceCodeFile) throws TransformException {
        ObjectMapper objectMapper = new ObjectMapper();

        NodeService nodeService = new NodeService(nodeUrl);

        Map<String, Map<Integer, DebugTraceTransactionLog>> traceData = null;

        try {
            nodeService.populateTraceDataResponse(txHash);
            traceData = nodeService.getAddressTrace();
        } catch (IOException e) {
            throw new TransformException("Failed getting debug trace for hash: " + txHash, e);
        }

        Path path = Paths.get(sourceCodeFile);
        String fileName = path.getFileName().toString();
        String contractName = fileName.substring(0, fileName.lastIndexOf("."));

        Solc solc = new Solc(sourceCodeFile);
        SolcOutput solcOutput = null;
        try {
            solcOutput = solc.compile();
        } catch (IOException | InterruptedException e) {
            throw new TransformException("Failed when compiling source", e);
        }
        Map<String, Contract> solcContracts = solcOutput.getContracts();

        List<ContractObject> contracts = new ArrayList<>();
        for (Map.Entry<String, Map<Integer, DebugTraceTransactionLog>> stringMapEntry : traceData.entrySet()) {
            String contractAddress = stringMapEntry.getKey();
            String contractPath = "";
            String cName = "";
            if (contractAddress.equals(NodeService.EMPTY_ADDRESS)) {
                contractPath = sourceCodeFile;
                cName = contractName;
            } else {
                try {
                    GetCodeResponse contractCodeFromChain = nodeService.getContractCode(contractAddress);
                    for (Map.Entry<String, Contract> stringContractEntry : solcContracts.entrySet()) {
                        String asmRuntime = LinkedDisassembler.cleanData(stringContractEntry.getValue().getBinRuntime())[0];
                        String chainRuntime = LinkedDisassembler.cleanData(contractCodeFromChain.getResult())[0];
                        if (asmRuntime.equals(chainRuntime)) {
                            String key = stringContractEntry.getKey();
                            String[] split = key.split(":");
                            contractPath = split[0];
                            cName = split[1];
                            break;
                        }
                    }
                } catch (IOException e) {
                    throw new TransformException("Failed when getting code for contract: " + contractAddress + ", txHash: " + txHash, e);
                }

            }

            Contract contract = solcContracts.get(contractPath + ":" + cName);
            List<Code> asmCode = contract.getAsm().getData().get("0").getCode();
            String code = contract.getBinRuntime();


            LinkedDisassembler disassembler = new LinkedDisassembler(code);
            List<OpcodeSource> opcodeSources = null;
            try {
                opcodeSources = disassembler.getOpcodeSources(asmCode);
            } catch (DisassemblerException e) {
                throw new TransformException("Failed when disassembling: " + contractAddress + " - " + contractPath, e);
            }
            path = Paths.get(contractPath);
            Map<Integer, DebugTraceTransactionLog> traceDataContract = traceData.get(contractAddress);
            String sourceCode = null;
            try {
                sourceCode = new String(Files.readAllBytes(path));
            } catch (IOException e) {
                throw new TransformException("Failed when reading source code from source file", e);
            }

            String traceMapJson = null;
            try {
                traceMapJson = objectMapper.writeValueAsString(traceDataContract);
            } catch (JsonProcessingException e) {
                throw new TransformException("Failed when mapping trace data", e);
            }

            CFGCreatorDefault cfgCreatorDefault = new CFGCreatorDefault();

            ContractBytecode contractBytecode = cfgCreatorDefault.createContractBytecode(opcodeSources, traceDataContract);
            Map<Integer, BytecodeChunk> runtimeChunks = contractBytecode.getRuntime().getChunks();

            GraphVizCreator graphVizCreator = new GraphVizCreator(runtimeChunks, traceDataContract, cName);
            String graph = graphVizCreator.buildStringGraph();

            ContractObject contractObject = new ContractObject(cName, contractPath, traceDataContract, contractAddress, code,
                    traceMapJson, opcodeSources, sourceCode, graph);
            contracts.add(contractObject);
        }

        return contracts;
    }
}
