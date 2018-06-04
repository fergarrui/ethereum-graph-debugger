package net.nandgr.debugger.asm.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public class Contract {

    private ContractAsm asm;

    public ContractAsm getAsm() {
        return asm;
    }

    public void setAsm(ContractAsm asm) {
        this.asm = asm;
    }
}
