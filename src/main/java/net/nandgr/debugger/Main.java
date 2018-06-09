package net.nandgr.debugger;

import net.nandgr.debugger.report.Report;
import net.nandgr.debugger.report.ReportException;
import net.nandgr.debugger.solc.Solc;
import net.nandgr.debugger.transformers.ContractObject;
import net.nandgr.debugger.transformers.SolidityTransformer;
import net.nandgr.debugger.transformers.TransformException;
import net.nandgr.debugger.transformers.Transformer;
import java.io.File;
import java.util.List;

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

        String sourceCodeFile = args[0];
        String nodeUrl = args[1];
        String txHash = args[2];

        if (!Solc.checkSolcInClasspath()) {
            System.out.println("solc was not found in classpath");
            System.exit(0);
        }

        // for now only solidity is supported
        Transformer solidityTransformer = new SolidityTransformer(nodeUrl, txHash);
        List<ContractObject> contracts = null;
        try {
            contracts = solidityTransformer.loadContracts(sourceCodeFile);
        } catch (TransformException e) {
            e.printStackTrace();
            System.exit(0);
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
