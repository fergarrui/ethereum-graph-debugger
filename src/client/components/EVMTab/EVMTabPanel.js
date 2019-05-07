import React from 'react';

import EVMState from '../EVMState/main';

import classnames from 'classnames/bind';

import styles from '../../styles/Tab/InnerTabPanel.scss';

const cx = classnames.bind(styles);

const EVMTabPanel = ({ active, evmData }) => {

  const tabPanelClasses = cx({
    'inner-tab-panel': true,
    'inner-tab-panel--active': !!active,
  });

  return (
    <div className={tabPanelClasses}>
      <EVMState evm={evmData} />
    </div>
  )
} 

export default EVMTabPanel;