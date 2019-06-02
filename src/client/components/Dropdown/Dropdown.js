import React from 'react';
import classnames from 'classnames/bind';

import styles from './Dropdown.scss';

const cx = classnames.bind(styles);

const Dropdown = ({ active, children, versions, settings, onClick }) => {

  const dropdownClasses = cx({
    'dropdown': true,
    'dropdown--active': !!active,
    'dropdown--versions': !!versions,
    'dropdown--settings': !!settings
  });

  return (
    <div className={dropdownClasses} onClick={onClick}>
      { children }
    </div>
  )
}

export default Dropdown;