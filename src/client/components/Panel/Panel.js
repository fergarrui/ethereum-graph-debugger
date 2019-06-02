import React from 'react';

import TransactionDebugger from '../TransactionDebugger/TransactionDebugger';
import Disassembler from '../Disassembler/Disassembler';
import ControlFlowGraphRuntime from '../ControlFlowGraphRuntime/ControlFlowGraphRuntime';
import ControlFlowGraphConstructor from '../ControlFlowGraphConstructor/ControlFlowGraphConstructor';
import StorageViewer from '../StorageViewer/StorageViewer';

import styles from './Panel.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Panel = ({ type, contractName, contractCode, contractPath, debuggerResponse, graphResponse, disassemblerResponse, storageResponse }) => {

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
        <ControlFlowGraphRuntime 
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graphResponse={graphResponse}
        />
      }
      {type === 'Control Flow Graph Constructor' &&
        <ControlFlowGraphConstructor 
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graphResponse={graphResponse}
        />
      }
      {type === 'Storage Viewer' &&
        <StorageViewer storageResponse={storageResponse} />
      }
    </div>
  );
}

Panel.displayName = 'Panel';

export default Panel;
