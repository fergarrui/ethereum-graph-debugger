package net.nandgr.debugger.cfg.graphviz;

import net.nandgr.debugger.Main;
import net.nandgr.debugger.cfg.beans.BytecodeChunk;
import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.node.response.json.DebugTraceTransactionLog;
import java.util.Map;

// Not the most elegant way to create the graph, but it works for now
public class GraphVizCreator {

    private final Map<Integer, BytecodeChunk> chunks;
    private final Map<Integer, DebugTraceTransactionLog> trace;
    private final String contractName;

    public GraphVizCreator(Map<Integer, BytecodeChunk> chunks, Map<Integer, DebugTraceTransactionLog> trace, String contractName) {
        this.chunks = chunks;
        this.trace = trace;
        this.contractName = contractName;
    }

    public String buildStringGraph() {
        StringBuilder sb = new StringBuilder("digraph \" \" {" + System.lineSeparator())
        .append("graph [splines=ortho ranksep=\"2\" nodesep=\"2\" bgcolor=\"#4A4A4A\"]").append(System.lineSeparator())
        .append("rankdir=LR").append(System.lineSeparator())
        .append("node [shape=plain fillcolor=\"#2A2A2A\" style=filled fontcolor=\"#12cc12\" fontname=\"Courier\"]").append(System.lineSeparator());
        for (BytecodeChunk bytecodeChunk : chunks.values()) {
            String coloredNode = "";
            if (Main.arguments.onlyTraceOpcodes &&  !chunkIsInTrace(bytecodeChunk)) {
                continue;
            }
            sb.append(bytecodeChunk.getId()).append("[").append(coloredNode).append("label=").append(buildLabel(bytecodeChunk)).append("]").append(System.lineSeparator());

            if (checkIfAppendBranch(bytecodeChunk.getBranchA())) {
                sb.append(bytecodeChunk.getId()).append("->").append(bytecodeChunk.getBranchA().getId()).append("[color=\"#12cc12\"];").append(System.lineSeparator());
            }
            if (checkIfAppendBranch(bytecodeChunk.getBranchB())) {
                sb.append(bytecodeChunk.getId()).append("->").append(bytecodeChunk.getBranchB().getId()).append("[color=\"#12cc12\"];").append(System.lineSeparator());
            }
        }
        sb.append("}");
        return sb.toString();
    }

    private boolean chunkIsInTrace(BytecodeChunk chunk) {
        for (OpcodeSource opcodeSource : chunk.getOpcodes()) {
            if (trace.containsKey(opcodeSource.getOffset())) {
                return true;
            }
        }
        return false;
    }

    private boolean checkIfAppendBranch(BytecodeChunk branch) {
        if (branch == null) {
            return false;
        }
        if (!Main.arguments.onlyTraceOpcodes) {
            return true;
        }
        return chunkIsInTrace(branch);
    }

    private String buildLabel(BytecodeChunk bytecodeChunk) {
        StringBuilder sb= new StringBuilder("< <TABLE BORDER=\"0\" CELLBORDER=\"1\" CELLSPACING=\"0\" CELLPADDING=\"4\">").append(System.lineSeparator());
        for (OpcodeSource opcodeSource : bytecodeChunk.getOpcodes()) {
            boolean isInTrace = trace.containsKey(opcodeSource.getOffset());

            String id = opcodeSource.getOffset() + "#" + opcodeSource.getBegin() + "#" + opcodeSource.getEnd();
            sb.append("<TR><TD ID=\"").append(id).append("#offset#").append(contractName).append("\" HREF=\" \">");
            if (isInTrace) {
                sb.append("<font color=\"#ff1020\">");
            }
            sb.append("0x").append(String.format("%04X", opcodeSource.getOffset()));
            if (isInTrace) {
                sb.append("</font>");
            }
            sb.append("</TD><TD ID=\"").append(id).append("#instr#").append(contractName).append("\" HREF=\" \">");
            if (isInTrace) {
                sb.append("<font color=\"#ff1020\">");
            }
            sb.append(opcodeSource.getOpcode());
            if (isInTrace) {
                sb.append("</font>");
            }
            sb.append("</TD>");
            if (opcodeSource.getParameter() != null) {
                sb.append("<TD>");
                if (isInTrace) {
                    sb.append("<font color=\"#ff1020\">");
                }
                sb.append("0x").append(opcodeSource.getParameter().toString(16));
                if (isInTrace) {
                    sb.append("</font>");
                }
                sb.append("</TD>");
            }
            sb.append("</TR>").append(System.lineSeparator());
        }
        sb.append("</TABLE> >").append(System.lineSeparator());
        return sb.toString();
    }
}
