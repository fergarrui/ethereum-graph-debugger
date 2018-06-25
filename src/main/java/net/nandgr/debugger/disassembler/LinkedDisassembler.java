package net.nandgr.debugger.disassembler;

import net.nandgr.debugger.cfg.beans.OpcodeSource;
import net.nandgr.debugger.solc.solcjson.Code;
import net.nandgr.eth.Disassembler;
import net.nandgr.eth.Opcode;
import java.util.ArrayList;
import java.util.List;

public class LinkedDisassembler extends Disassembler {

    public LinkedDisassembler(String code) {
        super(code);
    }

    public List<OpcodeSource> getOpcodeSources(List<Code> asmCode) throws DisassemblerException {
        List<Opcode> opcodes = super.getOpcodes();
        asmCode.removeIf(elem -> elem.getName().equals("tag"));

        if (!asmCode.isEmpty()) {
            if (opcodes.size()-1 != asmCode.size()) {
                throw new DisassemblerException("SolcOutput does not match with bytecode. Opcodes size: " + opcodes.size() + ", asm size: " + asmCode.size());
            }
        }

        List<OpcodeSource> opcodeSources = new ArrayList<>();
        for (int i = 0; i < opcodes.size() - 1; i++) {
            OpcodeSource opcodeSource = new OpcodeSource(opcodes.get(i));
            if (!asmCode.isEmpty()) {
                Code currentAsmOpcode = asmCode.get(i);
                opcodeSource.setBegin(currentAsmOpcode.getBegin());
                opcodeSource.setEnd(currentAsmOpcode.getEnd());
            }
            opcodeSources.add(opcodeSource);

        }

        return opcodeSources;
    }
}
