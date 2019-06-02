import React from 'react';

import styles from './TabPanel.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const TabPanel = ({ children, active }) => {

  const tabPanelClasses = cx({
    'tab-panel': true,
    'tab-panel--active': !!active,
  });
  return (
    <div className={tabPanelClasses}>
      {children}
    </div>
  )
}

TabPanel.displayName = 'TabPanel';

export default TabPanel;
