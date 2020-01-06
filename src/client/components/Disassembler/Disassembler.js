import React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../_redux/selectors';

import Accordion from '../Accordion/Accordion';
import AccordionSection from '../Accordion/AccordionSection/AccordionSection';
import Operations from './Operations/Operations';
import Bytecode from './Bytecode/Bytecode';

import styles from './Disassembler.scss';

const Disassembler = ({ disassembler, contractName }) => {
  const data = disassembler.find(res => res.name == contractName).data
  return (
    <div className={styles['disassemble-comp']}>
      <Accordion>
        <AccordionSection title='Bytecode'>
          <Bytecode bytecode={data.bytecode} />
        </AccordionSection>
        <AccordionSection title='Constructor Operations'>
          <Operations items={data.constructorOperations} />
        </AccordionSection>
        <AccordionSection title='Runtime Operations'>
          <Operations items={data.runtimeOperations} />
        </AccordionSection>
      </Accordion>
    </div>
  ); 
}

const mapStateToProps = state => ({
  disassembler: selectors.getDisassembler(state)
})

Disassembler.displayName = 'Disassembler';

export default connect(mapStateToProps, null)(Disassembler);
