import React from 'react';

import AccordionSection from './AccordionSection/main.js';

import styles from '../../styles/Accordion/Accordion.scss';

const Accordion = ({ children }) => (
  <div className={styles['accordion']}>
    {children}
  </div>
)

Accordion.displayName = 'Accordion';

export default Accordion;