package net.nandgr.debugger;

import com.google.devtools.common.options.Option;
import com.google.devtools.common.options.OptionsBase;
import com.google.devtools.common.options.OptionsParser;
import java.io.File;
import java.util.Collections;

public class Arguments extends OptionsBase {

    @Option(
        name = "source-file",
        abbrev = 'f',
        help = "The source file of the contract the transaction is executed against. Cannot be set in combination with -a",
        category = "mandatory",
        defaultValue = ""
    )
    public String sourceFile;

    @Option(
            name = "address",
            abbrev = 'a',
            help = "The Address of the contract the transaction is executed against. Cannot be set in combination with -f",
            category = "mandatory",
            defaultValue = ""
    )
    public String address;

    @Option(
        name = "node",
        abbrev = 'n',
        help = "The node where the transaction was run. It must support debug_traceTransaction",
        category = "mandatory",
        defaultValue = ""
    )
    public String nodeUrl;

    @Option(
        name = "transaction-hash",
        abbrev = 't',
        help = "Transaction hash to debug",
        category = "mandatory",
        defaultValue = ""
    )
    public String transactionHash;

    @Option(
        name = "d3-memory",
        abbrev = 'm',
        help = "D3 graph memory. If the graph is too large, you may want to increase this value (by multiplying it)",
        category = "optional",
        defaultValue = "537395200"
    )
    public String d3totalMemory;

    @Option(
            name = "only-trace",
            abbrev = 'o',
            help = "Exclude opcodes that are not executed in the transaction when creating the graph. " +
                    "This may help if the graph is too large and the opcodes not executed are not important",
            category = "optional",
            defaultValue = "false"
    )
    public boolean onlyTraceOpcodes;

    void validate(OptionsParser parser) {
        if (mandatoryParameters() || forbiddenCombinations()) {
            String execName = new File(Main.class.getProtectionDomain().getCodeSource().getLocation().getPath()).getName();
            System.out.println("Help: java -jar " + execName + " <OPTIONS>" + System.lineSeparator());
            System.out.println(parser.describeOptions(Collections.<String, String>emptyMap(), OptionsParser.HelpVerbosity.LONG));
            System.exit(0);
        }
    }

    private boolean forbiddenCombinations() {
        return !sourceFile.isEmpty() && !address.isEmpty();
    }

    private boolean mandatoryParameters() {
        return nodeUrl.isEmpty() || transactionHash.isEmpty() || (sourceFile.isEmpty() && address.isEmpty());
    }
}
