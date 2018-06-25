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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ByteCodeTransformer implements Transformer {

    private final String nodeUrl;
    private final String txHash;
    private final String address;

    public ByteCodeTransformer(String nodeUrl, String txHash, String address) {
        this.nodeUrl = nodeUrl;
        this.txHash = txHash;
        this.address = address;
    }

    @Override
    public List<ContractObject> loadContracts() throws TransformException {

        ObjectMapper objectMapper = new ObjectMapper();
        NodeService nodeService = new NodeService(nodeUrl);
        Map<String, Map<Integer, DebugTraceTransactionLog>> traceData = null;

        try {
            nodeService.populateTraceDataResponse(address, txHash);
            traceData = nodeService.getAddressTrace();
        } catch (IOException e) {
            throw new TransformException("Failed getting debug trace for hash: " + txHash, e);
        }

        List<ContractObject> contracts = new ArrayList<>();
        for (Map.Entry<String, Map<Integer, DebugTraceTransactionLog>> stringMapEntry : traceData.entrySet()) {
            String contractAddress = stringMapEntry.getKey();
            String cName = stringMapEntry.getKey();
            List<OpcodeSource> opcodeSources = null;
            String code;
            try {
                GetCodeResponse contractCodeFromChain = nodeService.getContractCode(contractAddress);
                code = contractCodeFromChain.getResult();
                LinkedDisassembler disassembler = new LinkedDisassembler(code);
                opcodeSources = disassembler.getOpcodeSources(Collections.emptyList());
            } catch (IOException e) {
                throw new TransformException("Failed when getting code for contract: " + contractAddress + ", txHash: " + txHash, e);
            } catch (DisassemblerException e) {
                throw new TransformException("Failed when disassembling: " + contractAddress + ", txHash: " + txHash, e);
            }
            Map<Integer, DebugTraceTransactionLog> traceDataContract = traceData.get(contractAddress);
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

            ContractObject contractObject = new ContractObject(cName, "", traceDataContract, contractAddress, code,
                    traceMapJson, opcodeSources, null, graph);
            contracts.add(contractObject);
        }
        return contracts;
    }
}
