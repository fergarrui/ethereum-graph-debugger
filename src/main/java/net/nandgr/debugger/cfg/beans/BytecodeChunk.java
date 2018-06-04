package net.nandgr.debugger.cfg.beans;


import java.util.ArrayList;
import java.util.List;

public class BytecodeChunk {

    private final int id;
    private BytecodeChunk branchA;
    private BytecodeChunk branchB;
    private List<OpcodeSource> opcodes = new ArrayList<>();

    public BytecodeChunk(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public BytecodeChunk getBranchA() {
        return branchA;
    }

    public void setBranchA(BytecodeChunk branchA) {
        this.branchA = branchA;
    }

    public BytecodeChunk getBranchB() {
        return branchB;
    }

    public void setBranchB(BytecodeChunk branchB) {
        this.branchB = branchB;
    }

    public List<OpcodeSource> getOpcodes() {
        return opcodes;
    }

    public void setOpcodes(List<OpcodeSource> opcodes) {
        this.opcodes = opcodes;
    }

    public boolean hasEmptyRelations() {
        return getBranchA() == null && getBranchB() == null;
    }

    @Override
    public String toString() {
        return "BytecodeChunk{" +
                "id=" + id +
                ", branchA=" + branchA +
                ", branchB=" + branchB +
                ", opcodes=" + opcodes +
                '}';
    }
}
