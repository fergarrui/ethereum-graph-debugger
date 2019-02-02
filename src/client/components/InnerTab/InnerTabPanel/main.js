import React from 'react';

import TransactionDebugger from '../../TransactionDebugger/main.js';
import Disassembler from '../../Disassembler/main.js';
import ControlFlowGraph from '../../ControlFlowGraph/main.js';

import styles from '../../../styles/Tab/InnerTabPanel.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const InnerTabPanel = ({ type, active, contractName, contractCode, contractPath, debuggerResponse, graphResponse, disassemblerResponse }) => {
  const tabPanelClasses = cx({
    'inner-tab-panel': true,
    'inner-tab-panel--active': !!active,
  });

  return (
    <div className={tabPanelClasses}>
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
      {type === 'Control Flow Graph' &&
        <ControlFlowGraph 
          contractPath={contractPath} 
          contractName={contractName} 
          contractCode={contractCode}
          graphResponse={graphResponse}
        />
      }
    </div>
  );
}

InnerTabPanel.displayName = 'InnerTabPanel';

export default InnerTabPanel;
