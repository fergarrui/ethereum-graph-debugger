package net.nandgr.debugger.cfg.graphviz;

import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.trace.response.json.DebugTraceTransactionLog;
import java.util.Map;

// Not the most elegant way to create the graph, but it works for now
public class GraphVizCreator {

    private final Map<Integer, BytecodeChunk> chunks;
    private final Map<Integer, DebugTraceTransactionLog> trace;

    public GraphVizCreator(Map<Integer, BytecodeChunk> chunks, Map<Integer, DebugTraceTransactionLog> trace) {
        this.chunks = chunks;
        this.trace = trace;
    }

    public String buildStringGraph() {
        StringBuilder sb = new StringBuilder("digraph \" \" {" + System.lineSeparator())
        .append("graph [splines=ortho ranksep=\"2\" nodesep=\"2\" bgcolor=\"#4A4A4A\"]").append(System.lineSeparator())
        .append("rankdir=LR").append(System.lineSeparator())
        .append("node [shape=plain fillcolor=\"#2A2A2A\" style=filled fontcolor=\"#12cc12\" fontname=\"Courier\"]").append(System.lineSeparator());
        for (BytecodeChunk bytecodeChunk : chunks.values()) {
            String coloredNode = "";
            OpcodeSource firstOpcode = bytecodeChunk.getOpcodes().get(0);
            if (trace.containsKey(firstOpcode.getOffset())) {
                coloredNode = " fontcolor=\"red\" ";
            }
            sb.append(bytecodeChunk.getId()).append("[").append(coloredNode).append("label=").append(buildLabel(bytecodeChunk)).append("]").append(System.lineSeparator());
            if (bytecodeChunk.getBranchA() != null) {
                sb.append(bytecodeChunk.getId()).append("->").append(bytecodeChunk.getBranchA().getId()).append("[color=\"#12cc12\"];").append(System.lineSeparator());
            }
            if (bytecodeChunk.getBranchB() != null) {
                sb.append(bytecodeChunk.getId()).append("->").append(bytecodeChunk.getBranchB().getId()).append("[color=\"#12cc12\"];").append(System.lineSeparator());
            }
        }
        sb.append("}");
        return sb.toString();
    }

    private String buildLabel(BytecodeChunk bytecodeChunk) {
        StringBuilder sb= new StringBuilder("< <TABLE BORDER=\"0\" CELLBORDER=\"1\" CELLSPACING=\"0\" CELLPADDING=\"4\">").append(System.lineSeparator());
        for (OpcodeSource opcodeSource : bytecodeChunk.getOpcodes()) {
            String id = opcodeSource.getOffset() + "#" + opcodeSource.getBegin() + "#" + opcodeSource.getEnd();
            sb.append("<TR><TD ID=\"").append(id).append("#offset\" HREF=\" \">")
                    .append(opcodeSource.getOffset())
                    .append("</TD><TD ID=\"").append(id).append("#instr\" HREF=\" \">")
                    .append(opcodeSource.getOpcode())
                    .append("</TD></TR>").append(System.lineSeparator());
        }
        sb.append("</TABLE> >").append(System.lineSeparator());
        return sb.toString();
    }
}
