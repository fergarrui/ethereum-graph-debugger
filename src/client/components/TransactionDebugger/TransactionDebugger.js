import React from 'react';

import Graph from '../Graph/Graph';

import styles from '../../styles/TransactionDebugger.scss';

const TransactionDebugger = ({ contractName, contractPath, debuggerResponse }) => {

  return (
    <div className={styles['transaction-debugger']}>
        <Graph 
          graphId={contractName} 
          contractPath={contractPath} 
          cfg={debuggerResponse.cfg} 
          graphType="debug"
          operations={debuggerResponse.operations}
          trace={debuggerResponse.trace}
        />
    </div>
  );
}

TransactionDebugger.displayName = 'TransactionDebugger';

export default TransactionDebugger;
