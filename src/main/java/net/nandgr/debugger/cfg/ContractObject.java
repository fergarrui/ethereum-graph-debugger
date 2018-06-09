package net.nandgr.debugger.cfg;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.node.response.json.DebugTraceTransactionLog;
import java.util.List;
import java.util.Map;

public class ContractObject {

    private final String contractName;
    private final String filePath;
    private final Map<Integer, DebugTraceTransactionLog> trace;
    private final String traceMapJson;
    private final String address;
    private final List<OpcodeSource> opcodes;
    private final String sourceCode;
    private final String graph;

    public ContractObject(String contractName, String filePath, Map<Integer, DebugTraceTransactionLog> trace, String address, String bytecode, String traceMapJson, List<OpcodeSource> opcodes, String sourceCode, String graph) {
        this.contractName = contractName;
        this.filePath = filePath;
        this.trace = trace;
        this.address = address;
        this.traceMapJson = traceMapJson;
        this.opcodes = opcodes;
        this.sourceCode = sourceCode;
        this.graph = graph;
    }

    public String getContractName() {
        return contractName;
    }

    public String getFilePath() {
        return filePath;
    }

    public Map<Integer, DebugTraceTransactionLog> getTrace() {
        return trace;
    }

    public String getTraceMapJson() {
        return traceMapJson;
    }

    public String getAddress() {
        return address;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public List<OpcodeSource> getOpcodes() {
        return opcodes;
    }

    public String getGraph() {
        return graph;
    }

    @Override
    public String toString() {
        return "ContractObject{" +
                "contractName='" + contractName + '\'' +
                ", filePath='" + filePath + '\'' +
                ", trace=" + trace +
                ", traceMapJson='" + traceMapJson + '\'' +
                ", address='" + address + '\'' +
                ", opcodes=" + opcodes +
                ", sourceCode='" + sourceCode + '\'' +
                ", graph='" + graph + '\'' +
                '}';
    }

    public String toStringJson() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(this);
    }
}
