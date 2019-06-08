import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraph.scss';

const ControlFlowGraphRuntime = ({ contractName, contractPath, graphResponse, graphType }) => {
  return (
    <div className={styles['control-flow-graph']}>
        <Graph 
          graphType={graphType}
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
