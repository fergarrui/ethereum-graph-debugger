import React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../_redux/selectors';

import TransactionDebugger from '../TransactionDebugger/TransactionDebugger';
import Disassembler from '../Disassembler/Disassembler';
import ControlFlowGraph from '../ControlFlowGraph/ControlFlowGraph';
import StorageViewer from '../StorageViewer/StorageViewer';
import EwasmAnalyzer from '../EwasmAnalyzer/EwasmAnalyzer';

import styles from './Panel.scss';

const Panel = ({ type, contractName, contractCode, contractPath, graph }) => {  
  return (
    <div className={styles['panel']}>
      {type === 'Transaction Debugger' && 
        <TransactionDebugger 
          contractPath={contractPath} 
          contractName={contractName} 
        />
      }
      {type === 'Disassembler' && 
        <Disassembler
          contractName={contractName}
        />
      }
      {type === 'Control Flow Graph Runtime' && 
        <ControlFlowGraph
          type='cfgruntime'
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graph={graph.find(res => res.name === contractName && !res.isConstructor).data}
        />
      }
      {type === 'Control Flow Graph Constructor' &&
        <ControlFlowGraph
          type='cfgconstructor' 
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graph={graph.find(res => res.name === contractName && res.isConstructor).data}
        />
      }
      {type === 'Storage Viewer' &&
        <StorageViewer contractName={contractName} />
      }
      {
        type === 'Ewasm Analyzer' &&
        <EwasmAnalyzer  contractName={contractName} />
      }
    </div>
  );
}

Panel.displayName = 'Panel';


const mapStateToProps = state => ({
  graph: selectors.getGraph(state)
})

export default connect(mapStateToProps, null)(Panel);
