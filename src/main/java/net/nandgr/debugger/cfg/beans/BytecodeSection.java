package net.nandgr.debugger.cfg.beans;

import java.util.Map;

public class BytecodeSection {

    private final Map<Integer, BytecodeChunk> chunks;

    public BytecodeSection(Map<Integer, BytecodeChunk> chunks) {
        this.chunks = chunks;
    }

    public Map<Integer, BytecodeChunk> getChunks() {
        return chunks;
    }
}
