package net.nandgr.debugger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.cfg.CFGCreatorDefault;
import net.nandgr.debugger.cfg.ContractObject;
import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.ContractBytecode;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.cfg.graphviz.GraphVizCreator;
import net.nandgr.debugger.disassembler.DisassemblerException;
import net.nandgr.debugger.disassembler.LinkedDisassembler;
import net.nandgr.debugger.node.response.json.GetCodeResponse;
import net.nandgr.debugger.report.Report;
import net.nandgr.debugger.report.ReportException;
import net.nandgr.debugger.solc.Solc;
import net.nandgr.debugger.solc.solcjson.Code;
import net.nandgr.debugger.solc.solcjson.Contract;
import net.nandgr.debugger.solc.solcjson.SolcOutput;
import net.nandgr.debugger.node.NodeService;
import net.nandgr.debugger.node.response.json.DebugTraceTransactionLog;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Main {

    public static void main(String[] args){

        if(args.length < 3) {
            String execName = new File(Main.class.getProtectionDomain()
                    .getCodeSource()
                    .getLocation()
                    .getPath())
                    .getName();
            System.out.println("Help: java -jar " + execName + " <solidity source file> <node URL> <transaction hash>");
            System.exit(0);
        }

        String solidityFile = args[0];
        String nodeUrl = args[1];
        String txHash = args[2];

        ObjectMapper objectMapper = new ObjectMapper();

        if (!Solc.checkSolcInClasspath()) {
            System.out.println("solc was not found in classpath");
            System.exit(0);
        }

        NodeService nodeService = new NodeService(nodeUrl);

        Map<String, Map<Integer, DebugTraceTransactionLog>> traceDataResponse = null;

        try {
            nodeService.populateTraceDataResponse(txHash);
            traceDataResponse = nodeService.getAddressTrace();
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(0);
        }

        Path path = Paths.get(solidityFile);
        String fileName = path.getFileName().toString();
        String contractName = fileName.substring(0, fileName.lastIndexOf("."));

        Solc solc = new Solc(solidityFile);
        SolcOutput solcOutput = null;
        try {
            solcOutput = solc.compile();
        } catch (IOException | InterruptedException e) {
            System.out.println("Failed when compiling source");
            e.printStackTrace();
            System.exit(0);
        }
        Map<String, Contract> solcContracts = solcOutput.getContracts();

        List<ContractObject> contracts = new ArrayList<>();
        for (Map.Entry<String, Map<Integer, DebugTraceTransactionLog>> stringMapEntry : traceDataResponse.entrySet()) {
            String contractAddress = stringMapEntry.getKey();
            Map<Integer, DebugTraceTransactionLog> contractTrace = stringMapEntry.getValue();
            String contractPath = "";
            String cName = "";
            if (contractAddress.equals(NodeService.EMPTY_ADDRESS)) {
                contractPath = solidityFile;
                cName = contractName;
            } else {
                GetCodeResponse contractCodeFromChain = null;
                try {
                    contractCodeFromChain = nodeService.getContractCode(contractAddress);
                    for (Map.Entry<String, Contract> stringContractEntry : solcContracts.entrySet()) {
                        String asmRuntime = LinkedDisassembler.cleanData(stringContractEntry.getValue().getBinRuntime())[0];
                        String chainRuntime = LinkedDisassembler.cleanData(contractCodeFromChain.getResult())[0];
                        if (asmRuntime.equals(chainRuntime)) {
                            System.out.println(contractAddress);
                            System.out.println(stringContractEntry.getKey());
                            String key = stringContractEntry.getKey();
                            String[] split = key.split(":");
                            contractPath = split[0];
                            cName = split[1];
                            break;
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
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
                System.out.println("Failed when disassembling: " + contractAddress + " - " + contractPath);
                e.printStackTrace();
                System.exit(0);
            }
            path = Paths.get(contractPath);
            Map<Integer, DebugTraceTransactionLog> traceData = traceDataResponse.get(contractAddress);
            String sourceCode = null;
            try {
                sourceCode = new String(Files.readAllBytes(path));
            } catch (IOException e) {
                System.out.println("Failed when reading source code from source file");
                e.printStackTrace();
                System.exit(0);
            }

            String traceMapJson = null;
            try {
                traceMapJson = objectMapper.writeValueAsString(traceData);
            } catch (JsonProcessingException e) {
                System.out.println("Failed when mapping trace data");
                e.printStackTrace();
                System.exit(0);
            }

            CFGCreatorDefault cfgCreatorDefault = new CFGCreatorDefault();

            ContractBytecode contractBytecode = cfgCreatorDefault.createContractBytecode(opcodeSources);
            Map<Integer, BytecodeChunk> runtimeChunks = contractBytecode.getRuntime().getChunks();

            GraphVizCreator graphVizCreator = new GraphVizCreator(runtimeChunks, traceData, cName);
            String graph = graphVizCreator.buildStringGraph();

            ContractObject contractObject = new ContractObject(cName, contractPath, traceData, contractAddress, code,
                    traceMapJson, opcodeSources, sourceCode, graph);
            contracts.add(contractObject);
        }



        Report report = new Report(contracts, txHash);
        String reportName = null;
        try {
            reportName = report.createReport();
        } catch (ReportException e) {
            System.out.println("Failed when creating report");
            e.printStackTrace();
            System.exit(0);
        }
        System.out.println("Debug file created at: " + reportName);
    }
}
