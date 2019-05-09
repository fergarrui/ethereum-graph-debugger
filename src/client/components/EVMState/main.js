import React from 'react';
import { connect } from 'react-redux';

import styles from '../../styles/EVMState.scss';

const EVMState = ({ evm }) => {

  return (
    <div className={styles['evm-state']}>
      <div className={styles['evm-state__item']}>
        <div className={styles['evm-state__item__title']}>
          <h4>Gas</h4>
        </div>
        <div className={styles['evm-state__item__content']}>
          <span>{evm.gas}</span>
        </div>
        <div className={styles['evm-state__item__title']} style={{marginLeft: '10px'}}>
          <h4>GasCost</h4>
        </div>
        <div className={styles['evm-state__item__content']}>
          <span>{evm.gasCost}</span>
        </div>
      </div>
      <div className={styles['evm-state__item']}>
        <div className={styles['evm-state__item__title']}>
          <h4>Stack</h4>
        </div>
        <div className={styles['evm-state__item__content']}>
          { evm.stack && evm.stack.length ?
              evm.stack.map((item, i) => {
                return (
                  <div className={styles['evm-state__item__content__row']} key={i}>
                    <span>{item}</span>
                  </div>
                )
              })
            : <div className={styles['evm-state__item__content__row']}><span>Stack is empty</span></div>           
          }
        </div>
      </div>
      <div className={styles['evm-state__item']}>
        <div className={styles['evm-state__item__title']}>
          <h4>Memory</h4>
        </div>
        <div className={styles['evm-state__item__content']}>
          { evm.memory && evm.memory.length ?
            evm.memory.map((item, i) => {
              return (
                <div className={styles['evm-state__item__content__row']} key={i}>
                  <span>{item}</span>
                </div>
              )
            })
            : <div className={styles['evm-state__item__content__row']}><span>Memory is empty</span></div>
          }
        </div>
      </div>
      <div className={styles['evm-state__item']}>
        <div className={styles['evm-state__item__title']}>
          <h4>{`Storage`}</h4>
        </div>
        <div className={styles['evm-state__item__content']}>
          { evm.storage && Object.keys(evm.storage).length ?
            Object.keys(evm.storage).map((key, i) => {
              return (
                <div className={styles['evm-state__item__content__row']} key={i}>
                  <div className={styles['evm-state__item__content__row__key']}>
                    <div className={styles['label']}><span>{`K`}</span></div>
                    <div><span>{key}</span></div>
                  </div>
                  <div className={styles['evm-state__item__content__row__value']}>
                    <div className={styles['label']}><span>{`V`}</span></div>
                    <div><span>{evm.storage[key]}</span></div>
                  </div>
                </div>
              )
            })
            : <div className={styles['evm-state__item__content__row']}><span>{`Storage`} is empty</span></div>
          }
        </div>
      </div>
    </div>
  )
}

EVMState.displayName = 'EVMState';

export default EVMState;

