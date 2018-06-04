package net.nandgr.debugger.asm.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ContractAsm {

    @JsonProperty(".data")
    private Map<String, ContractData> data;

    public Map<String, ContractData> getData() {
        return data;
    }

    public void setData(Map<String, ContractData> data) {
        this.data = data;
    }
}
