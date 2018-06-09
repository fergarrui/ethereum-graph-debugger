package net.nandgr.debugger.transformers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.node.response.json.DebugTraceTransactionLog;
import java.util.List;
import java.util.Map;

public class ContractObject {

    private String contractName;
    private String filePath;
    private Map<Integer, DebugTraceTransactionLog> trace;
    private String traceMapJson;
    private String address;
    private List<OpcodeSource> opcodes;
    private String sourceCode;
    private String graph;

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

    public ContractObject() {
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Map<Integer, DebugTraceTransactionLog> getTrace() {
        return trace;
    }

    public void setTrace(Map<Integer, DebugTraceTransactionLog> trace) {
        this.trace = trace;
    }

    public String getTraceMapJson() {
        return traceMapJson;
    }

    public void setTraceMapJson(String traceMapJson) {
        this.traceMapJson = traceMapJson;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<OpcodeSource> getOpcodes() {
        return opcodes;
    }

    public void setOpcodes(List<OpcodeSource> opcodes) {
        this.opcodes = opcodes;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getGraph() {
        return graph;
    }

    public void setGraph(String graph) {
        this.graph = graph;
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
