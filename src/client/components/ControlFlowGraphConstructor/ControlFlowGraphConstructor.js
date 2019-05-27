import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraphConstructor.scss';

const ControlFlowGraphConstructor = ({ contractName, contractPath, graphResponse }) => {
  return (
    <div className={styles['control-flow-graph']}>
        <Graph 
          graphType="cfgconstructor" 
          graphId={contractName} 
          contractPath={contractPath} 
          cfg={graphResponse.cfg} 
          operations={graphResponse.operations}
        />
    </div>
  );
}

ControlFlowGraphConstructor.displayName = 'ControlFlowGraphConstructor';

export default ControlFlowGraphConstructor;
