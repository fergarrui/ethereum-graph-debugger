import React from 'react';
import classnames from 'classnames/bind';

import styles from './TabPanel.scss';

const cx = classnames.bind(styles);

const TabPanel = ({ children, active, className }) => {
  const tabPanelClasses = cx({
    'tab-panel': true,
    'tab-panel--active': !!active
  });
  return (
    <div className={cx(tabPanelClasses, className)}>
      {children}
    </div>
  )
}

TabPanel.displayName = 'TabPanel';

export default TabPanel;
