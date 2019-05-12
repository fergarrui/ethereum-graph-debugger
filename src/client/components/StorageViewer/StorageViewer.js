import React from 'react';

import styles from './StorageViewer.scss';

const StorageViewer = ({ storageResponse }) => {

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
      </div>
      <div className={styles['storage__body']}>
        {
          Object.entries(storageResponse.storage).map(([key, val]) => {
            return (
              <div className={styles['storage__body__item']} key={key}>
                <div className={styles['storage__body__item__col']}>
                  <span>{key}</span>
                </div>
                <div className={styles['storage__body__item__col']}>
                  <span>{val.value}</span>
                </div>
              </div>
            )    
          })
        }
      </div>
    
    </div>
  )
}

export default StorageViewer;