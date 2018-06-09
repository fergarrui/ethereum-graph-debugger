package net.nandgr.debugger.node.response.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties
public class DebugTraceTransactionResult {

    private int gas;
    private String returnValue;
    private List<DebugTraceTransactionLog> structLogs;

    public int getGas() {
        return gas;
    }

    public void setGas(int gas) {
        this.gas = gas;
    }

    public String getReturnValue() {
        return returnValue;
    }

    public void setReturnValue(String returnValue) {
        this.returnValue = returnValue;
    }

    public List<DebugTraceTransactionLog> getStructLogs() {
        return structLogs;
    }

    public void setStructLogs(List<DebugTraceTransactionLog> structLogs) {
        this.structLogs = structLogs;
    }

    @Override
    public String toString() {
        return "DebugTraceTransactionResult{" +
                "gas=" + gas +
                ", returnValue='" + returnValue + '\'' +
                ", structLogs=" + structLogs +
                '}';
    }
}
