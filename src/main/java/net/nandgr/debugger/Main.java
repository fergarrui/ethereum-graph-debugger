package net.nandgr.debugger;

import com.google.devtools.common.options.OptionsParser;
import net.nandgr.debugger.report.Report;
import net.nandgr.debugger.report.ReportException;
import net.nandgr.debugger.transformers.*;

import java.util.List;

public class Main {

    public static Arguments arguments;

    public static void main(String[] args){

        parseArguments(args);
        Transformer transformer;
        if (!arguments.address.isEmpty()) {
            transformer = new ByteCodeTransformer(arguments.nodeUrl, arguments.transactionHash, arguments.address);
        } else {
            transformer = new SolidityTransformer(arguments.nodeUrl, arguments.transactionHash, arguments.sourceFile);
        }

        List<ContractObject> contracts = null;
        try {
            contracts = transformer.loadContracts();
        } catch (TransformException e) {
            e.printStackTrace();
            System.exit(0);
        }

        Report report = new Report(contracts, arguments.transactionHash);
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

    private static void parseArguments(String[] args) {
        OptionsParser optionsParser = OptionsParser.newOptionsParser(Arguments.class);
        optionsParser.parseAndExitUponError(args);
        arguments = optionsParser.getOptions(Arguments.class);
        arguments.validate(optionsParser);
    }
}
