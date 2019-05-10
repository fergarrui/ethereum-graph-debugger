import React from 'react';

import styles from './Operations.scss'

const Operations = ({ items }) => {
  return (
    <div>
      <div className={styles['operations']}>
          <div className={styles['operations__item']}>
            <span>[Offset]</span>
          </div>
          <div className={styles['operations__item']}>
            <span>[Opcode hex]</span>
          </div>  
          <div className={styles['operations__item']}>
            <span>[Opcode]</span>
          </div>          
              <div className={styles['operations__item']}>
                <span>[Argument]</span>
              </div>
      </div>
    {items.map((item, i) => {
      return (
        <div key={i} className={styles['operations']}>
          <div className={styles['operations__item']}>
            <span>{`0x`}{item.offset.toString(16)}</span>
          </div>
          <div className={styles['operations__item']}>
            <span>{`0x`}{item.opcode.opcode.toString(16)}</span>
          </div>  
          <div className={styles['operations__item']}>
            <span>{item.opcode.name}</span>
          </div>          
            { item.opcode.parameters > 0 && 
              <div className={styles['operations__item']}>
                <span>{`0x`}{item.argument}</span>
              </div>
            }
        </div>
      )
    })}
    </div>
  )
}

Operations.displayName = 'Operations';

export default Operations;