import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraph.scss';

const ControlFlowGraphRuntime = ({ contractName, contractPath, graphResponse, type }) => {
  return (
    <div className={styles['control-flow-graph']}>
        <Graph 
          graphType={type}
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
