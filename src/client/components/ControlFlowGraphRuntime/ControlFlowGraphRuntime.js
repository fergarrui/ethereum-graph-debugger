import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraphRuntime.scss';

const ControlFlowGraphRuntime = ({ contractName, contractPath, graphResponse }) => {
  return (
    <div className={styles['control-flow-graph']}>
        <Graph 
          graphType="cfgruntime" 
          graphId={contractName} 
          contractPath={contractPath} 
          cfg={graphResponse.cfg} 
          operations={graphResponse.operations}
        />
    </div>
  );
}

ControlFlowGraphRuntime.displayName = 'ControlFlowGraphRuntime';

export default ControlFlowGraphRuntime;
