package net.nandgr.debugger.node.response.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@JsonIgnoreProperties
public class DebugTraceTransactionLog {

    private int depth;
    private String error;
    private int gas;
    private int gasCost;
    private List<String> memory;
    private String op;
    private int pc;
    private List<String> stack;
    private Map<String, String> storage;

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public int getGas() {
        return gas;
    }

    public void setGas(int gas) {
        this.gas = gas;
    }

    public int getGasCost() {
        return gasCost;
    }

    public void setGasCost(int gasCost) {
        this.gasCost = gasCost;
    }

    public List<String> getMemory() {
        return memory;
    }

    public void setMemory(List<String> memory) {
        this.memory = memory;
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    public int getPc() {
        return pc;
    }

    public void setPc(int pc) {
        this.pc = pc;
    }

    public List<String> getStack() {
        return stack;
    }

    public void setStack(List<String> stack) {
        this.stack = stack;
    }

    public Map<String, String> getStorage() {
        return storage;
    }

    public void setStorage(Map<String, String> storage) {
        this.storage = storage;
    }

    @Override
    public String toString() {
        return "DebugTraceTransactionLog{" +
                "depth=" + depth +
                ", error='" + error + '\'' +
                ", gas=" + gas +
                ", gasCost=" + gasCost +
                ", memory=" + memory +
                ", op='" + op + '\'' +
                ", pc=" + pc +
                ", stack=" + stack +
                ", storage=" + storage +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DebugTraceTransactionLog that = (DebugTraceTransactionLog) o;
        return depth == that.depth &&
                gas == that.gas &&
                gasCost == that.gasCost &&
                pc == that.pc &&
                Objects.equals(error, that.error) &&
                Objects.equals(memory, that.memory) &&
                Objects.equals(op, that.op) &&
                Objects.equals(stack, that.stack) &&
                Objects.equals(storage, that.storage);
    }

    @Override
    public int hashCode() {

        return Objects.hash(depth, error, gas, gasCost, memory, op, pc, stack, storage);
    }
}
