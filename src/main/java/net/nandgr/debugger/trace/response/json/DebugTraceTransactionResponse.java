package net.nandgr.debugger.trace.response.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public class DebugTraceTransactionResponse {

    private String jsonrpc;
    private DebugTraceTransactionResult result;

    public String getJsonrpc() {
        return jsonrpc;
    }

    public void setJsonrpc(String jsonrpc) {
        this.jsonrpc = jsonrpc;
    }

    public DebugTraceTransactionResult getResult() {
        return result;
    }

    public void setResult(DebugTraceTransactionResult result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "DebugTraceTransactionResponse{" +
                "jsonrpc='" + jsonrpc + '\'' +
                ", result=" + result +
                '}';
    }
}
