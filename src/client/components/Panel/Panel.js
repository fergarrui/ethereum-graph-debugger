import React from 'react';

import TransactionDebugger from '../TransactionDebugger/TransactionDebugger';
import Disassembler from '../Disassembler/Disassembler';
import ControlFlowGraph from '../ControlFlowGraph/ControlFlowGraph';
import StorageViewer from '../StorageViewer/StorageViewer';
import Execute from '../Execute/Execute';

import styles from './Panel.scss';

const Panel = ({ type, contractName, contractCode, contractPath, 
  debuggerResponse, graphResponse, disassemblerResponse, 
  storageResponse, executeResponse }) => {

  return (
    <div className={styles['panel']}>
      {type === 'Transaction Debugger' && 
        <TransactionDebugger 
          contractPath={contractPath} 
          contractName={contractName} 
          debuggerResponse={debuggerResponse}
        />
      }
      {type === 'Disassembler' && 
        <Disassembler
          disassemblerResponse={disassemblerResponse}
        />
      }
      {type === 'Control Flow Graph Runtime' &&
        <ControlFlowGraph
          graphType='cfgruntime'
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graphResponse={graphResponse}
        />
      }
      {type === 'Control Flow Graph Constructor' &&
        <ControlFlowGraph
          graphType='constructor' 
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graphResponse={graphResponse}
        />
      }
      {type === 'Storage Viewer' &&
        <StorageViewer storageResponse={storageResponse} />
      }
      {
        type === 'Execute' &&
        <Execute 
          executeResponse={executeResponse}
          contractPath={contractPath}
          contractCode={contractCode}
         />
      }
    </div>
  );
}

Panel.displayName = 'Panel';

export default Panel;
