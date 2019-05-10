import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraph.scss';

const ControlFlowGraph = ({ contractName, contractPath, graphResponse }) => {
  return (
    <div className={styles['control-flow-graph']}>
        <Graph 
          graphType="cfg" 
          graphId={contractName} 
          contractPath={contractPath} 
          cfg={graphResponse.cfg} 
          operations={graphResponse.operations}
        />
    </div>
  );
}

ControlFlowGraph.displayName = 'ControlFlowGraph';

export default ControlFlowGraph;
