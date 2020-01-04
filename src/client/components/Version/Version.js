import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../_redux/actions';

import styles from './Version.scss';

const mapDispatchToProps = {
  getVersionNumber: actions.getVersionNumber,
  postVersion: actions.postVersion
};

const Version = ({ data, getVersionNumber, onVersionItemClick, postVersion }) => {

  const handleSelect = (item) => {
    postVersion({ version: item.commit });
    onVersionItemClick();
    getVersionNumber(item.version);
  }

  return (
    <div className={styles['version']}>
      {
        data.map(item => {
          return (
            <div 
              key={`id--${item.version}`}
              className={styles['version__item']}
              onClick={() => handleSelect(item)}
              >
              <span>{item.version}</span>
            </div>
        )})
      }
    </div>
  )
}

export default connect(null, mapDispatchToProps)(Version);