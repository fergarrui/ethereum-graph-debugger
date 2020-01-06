import React from 'react';
import { connect } from 'react-redux';

import * as selectros from '../../_redux/selectors';

import Graph from '../Graph/Graph';

import styles from './TransactionDebugger.scss';

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

const mapStateToProps = state => ({
  transactionDebugger: selectros.getTransactionDebugger(state)
})

TransactionDebugger.displayName = 'TransactionDebugger';

export default connect(mapStateToProps, null)(TransactionDebugger);
