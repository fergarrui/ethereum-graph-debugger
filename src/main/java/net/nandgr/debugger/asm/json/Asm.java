package net.nandgr.debugger.asm.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

@JsonIgnoreProperties
public class Asm {

    private Map<String, Contract> contracts;
    private String version;

    public Map<String, Contract> getContracts() {
        return contracts;
    }

    public void setContracts(Map<String, Contract> contracts) {
        this.contracts = contracts;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
