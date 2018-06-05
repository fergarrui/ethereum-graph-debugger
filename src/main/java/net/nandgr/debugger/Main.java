package net.nandgr.debugger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.cfg.CFGCreatorDefault;
import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.ContractBytecode;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.cfg.graphviz.GraphVizCreator;
import net.nandgr.debugger.disassembler.DisassemblerException;
import net.nandgr.debugger.disassembler.LinkedDisassembler;
import net.nandgr.debugger.report.Report;
import net.nandgr.debugger.report.ReportException;
import net.nandgr.debugger.solc.Solc;
import net.nandgr.debugger.solc.solcjson.Code;
import net.nandgr.debugger.solc.solcjson.Contract;
import net.nandgr.debugger.solc.solcjson.SolcOutput;
import net.nandgr.debugger.trace.TraceService;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionLog;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
            System.out.println("Help: " + execName + " <solidity source file> <node URL> <transaction hash>");
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

        TraceService traceService = new TraceService(nodeUrl);
        Map<Integer, DebugTraceTransactionLog> traceData = null;
        try {
            traceData = traceService.getTraceData(txHash);
        } catch (IOException e) {
            System.out.println("Failed when getting transaction trace");
            e.printStackTrace();
            System.exit(0);
        }
        Path path = Paths.get(solidityFile);
        String sourceCode = null;
        try {
            sourceCode = new String(Files.readAllBytes(path));
        } catch (IOException e) {
            System.out.println("Failed when reading source code from source file");
            e.printStackTrace();
            System.exit(0);
        }
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

        Contract contract = solcOutput.getContracts().get(solidityFile + ":" + contractName);
        List<Code> asmCode = contract.getAsm().getData().get("0").getCode();
        String code = contract.getBinRuntime();

        LinkedDisassembler disassembler = new LinkedDisassembler(code);
        List<OpcodeSource> opcodeSources = null;
        try {
            opcodeSources = disassembler.getOpcodeSources(asmCode);
        } catch (DisassemblerException e) {
            System.out.println("Failed when disassembling");
            e.printStackTrace();
            System.exit(0);
        }

        CFGCreatorDefault cfgCreatorDefault = new CFGCreatorDefault();

        ContractBytecode contractBytecode = cfgCreatorDefault.createContractBytecode(opcodeSources);
        Map<Integer, BytecodeChunk> runtimeChunks = contractBytecode.getRuntime().getChunks();

        String traceMapJson = null;
        try {
            traceMapJson = objectMapper.writeValueAsString(traceData);
        } catch (JsonProcessingException e) {
            System.out.println("Failed when mapping trace data");
            e.printStackTrace();
            System.exit(0);
        }

        GraphVizCreator graphVizCreator = new GraphVizCreator(runtimeChunks, traceData);
        String graph = graphVizCreator.buildStringGraph();

        Report report = new Report(sourceCode, traceMapJson, graph, solidityFile, txHash);
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
