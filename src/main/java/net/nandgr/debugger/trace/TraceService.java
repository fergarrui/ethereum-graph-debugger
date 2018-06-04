package net.nandgr.debugger.trace;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.trace.request.json.DebugTraceTransactionRequest;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionLog;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionResponse;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class TraceService {

    private final String nodeUrl;

    public TraceService(String nodeUrl) {
        this.nodeUrl = nodeUrl;
    }

    public Map<Integer, DebugTraceTransactionLog> getTraceData(String txHash) throws IOException {
        DebugTraceTransactionRequest requestJson = new DebugTraceTransactionRequest();
        requestJson.addTransactionHashAsParam(txHash);
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(requestJson);

        HttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost request = new HttpPost(nodeUrl);
        StringEntity stringEntity = new StringEntity(json);
        request.setEntity(stringEntity);
        HttpResponse response = httpClient.execute(request);
        HttpEntity responseEntity = response.getEntity();

        String responseJson = EntityUtils.toString(responseEntity);
        DebugTraceTransactionResponse debugTraceTransactionResponse = objectMapper.readValue(responseJson, DebugTraceTransactionResponse.class);
        Map<Integer, DebugTraceTransactionLog> mapResult = new HashMap<>();
        for (DebugTraceTransactionLog structLog : debugTraceTransactionResponse.getResult().getStructLogs()) {
            int pc = structLog.getPc();
            mapResult.put(pc, structLog);
        }
        return mapResult;
    }
}
