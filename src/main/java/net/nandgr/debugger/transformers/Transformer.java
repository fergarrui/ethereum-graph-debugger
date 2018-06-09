package net.nandgr.debugger.transformers;

import java.util.List;

public interface Transformer {

    List<ContractObject> loadContracts(String sourceCodeFile) throws TransformException;
}
