import React from 'react';

import Accordion from '../Accordion/Accordion';
import AccordionSection from '../Accordion/AccordionSection/AccordionSection';
import Operations from './Operations/Operations';
import Bytecode from './Bytecode/Bytecode';

import styles from './Disassembler.scss';

const Disassembler = ({ disassemblerResponse }) => {

    return (
      <div className={styles['disassemble-comp']}>
        <Accordion>
          <AccordionSection title='Bytecode'>
            <Bytecode bytecode={disassemblerResponse.bytecode} />
          </AccordionSection>
          <AccordionSection title='Constructor Operations'>
            <Operations items={disassemblerResponse.constructorOperations} />
          </AccordionSection>
          <AccordionSection title='Runtime Operations'>
            <Operations items={disassemblerResponse.runtimeOperations} />
          </AccordionSection>
        </Accordion>
      </div>
    );
  
}

Disassembler.displayName = 'Disassembler';

export default Disassembler;
