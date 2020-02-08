import React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../_redux/selectors';

import Graph from '../Graph/Graph';

import styles from './TransactionDebugger.scss';

const TransactionDebugger = ({ contractName, contractPath, transactionDebugger }) => {
const data = transactionDebugger.find(res => res.name === contractName).data
  return (
    <div className={styles['transaction-debugger']}>
        <Graph 
          graphId={contractName} 
          contractPath={contractPath} 
          cfg={data.cfg} 
          graphType="debug"
          operations={data.operations}
          trace={data.trace}
        />
    </div>
  );
}

const mapStateToProps = state => ({
  transactionDebugger: selectors.getTransactionDebugger(state)
})

TransactionDebugger.displayName = 'TransactionDebugger';

export default connect(mapStateToProps, null)(TransactionDebugger);
