package net.nandgr.debugger.cfg.beans;

import net.nandgr.eth.Opcode;

public class OpcodeSource extends Opcode {

    public OpcodeSource(Opcode opcode) {
        super(opcode.getOffset(), opcode.getOpcode(), opcode.getParameter());
    }

    private int begin;
    private int end;

    public int getBegin() {
        return begin;
    }

    public void setBegin(int begin) {
        this.begin = begin;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return super.toString() + " - begin=" + begin + ", end=" + end;
    }
}
