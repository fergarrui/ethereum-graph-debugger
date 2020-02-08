import React from 'react';

import Graph from '../Graph/Graph';

import styles from './ControlFlowGraph.scss';

const ControlFlowGraph = ({ contractName, contractPath, graph, type }) => {
  return (
    <div className={styles['control-flow-graph']}>
      <Graph 
        graphType={type}
        graphId={contractName} 
        contractPath={contractPath} 
        cfg={graph.cfg} 
        operations={graph.operations}
      />
    </div>
  );
}

ControlFlowGraph.displayName = 'ControlFlowGraph';

export default ControlFlowGraph;
