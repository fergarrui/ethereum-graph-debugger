import React from 'react';

import styles from './SideBar.scss';

class SideBar extends React.Component {

  handleClick(type) {
    this.props.onClick(type);
  }

  render() {

    const { onTransactionDebuggerClick, onControlFlowGraphRuntimeClick, onControlFlowGraphConstructorClick, onDisassemblerClick, onViewStorageClick } = this.props;

    return (
      <div className={styles['side-bar']}>
        <div className={styles['side-bar__item']} onClick={onTransactionDebuggerClick}>
          <span>Debug Transaction</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onDisassemblerClick}>
          <span>Disassembler</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onControlFlowGraphConstructorClick}>
          <span>Control Flow Graph Constructor</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onControlFlowGraphRuntimeClick}>
          <span>Control Flow Graph Runtime</span>
        </div>
        <div className={styles['side-bar__item']} onClick={onViewStorageClick}>
          <span>View Storage</span>
        </div>
      </div>
    )
  }
}

SideBar.displayName = 'SideBar';

export default SideBar;
