import React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../_redux/selectors';

import styles from './StorageViewer.scss';

const StorageViewer = ({ storage }) => {
  const data = storage.find(res => res.name === contractName).data;
  return (
    <div className={styles['storage']}>
      <div className={styles['storage__header']}>
        <div className={styles['storage__header__item']}>
          <span>
            Slot
          </span>
        </div>
        <div className={styles['storage__header__item']}>
          <span>
            Value
          </span>
        </div>
        <div className={styles['storage__header__item']}>
          <span>
            Set in block
          </span>
        </div>
        <div className={styles['storage__header__item']}>
          <span>
            Set in transaction
          </span>
        </div>
      </div>
      <div className={styles['storage__body']}>
        {
          Object.entries(data.storage).map(([key, val]) => {
            return (
              <div className={styles['storage__body__item']} key={key}>
                <div className={styles['storage__body__item__col']}>
                  <span>{`0x${key}`}</span>
                </div>
                <div className={styles['storage__body__item__col']}>
                  <span>{`0x${val.value}`}</span>
                </div>
                <div className={styles['storage__body__item__col']}>
                  <span>{`${val.block}`}</span>
                </div>
                <div className={styles['storage__body__item__col']}>
                  <span>{`${val.transactionHash}`}</span>
                </div>
              </div>
            )
          })
        }
      </div>
    
    </div>
  )
}

StorageViewer.displayName = 'StorageViewer';

const mapStateToProps = state => ({
  storage: selectors.getStorage(state)
})

export default connect(mapStateToProps, null)(StorageViewer);