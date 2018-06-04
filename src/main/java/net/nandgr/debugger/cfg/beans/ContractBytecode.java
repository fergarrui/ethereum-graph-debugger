package net.nandgr.debugger.cfg.beans;

public class ContractBytecode {

    private final BytecodeSection constructor;
    private final BytecodeSection runtime;

    public ContractBytecode(BytecodeSection constructor, BytecodeSection runtime) {
        this.constructor = constructor;
        this.runtime = runtime;
    }

    public BytecodeSection getConstructor() {
        return constructor;
    }

    public BytecodeSection getRuntime() {
        return runtime;
    }
}
