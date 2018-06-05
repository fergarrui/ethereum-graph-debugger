package net.nandgr.debugger.solc.solcjson;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public class Contract {

    private ContractAsm asm;
    @JsonProperty("bin-runtime")
    private String binRuntime;

    public ContractAsm getAsm() {
        return asm;
    }

    public void setAsm(ContractAsm asm) {
        this.asm = asm;
    }

    public String getBinRuntime() {
        return binRuntime;
    }

    public void setBinRuntime(String binRuntime) {
        this.binRuntime = binRuntime;
    }
}
