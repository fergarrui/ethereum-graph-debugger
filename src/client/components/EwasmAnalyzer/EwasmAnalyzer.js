import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Tab from '../Tab/Tab';
import TabPanel from '../Tab/TabPanel/TabPanel';
import { SideBar, SideBarItem } from '../SideBar/SideBar';
import Graph from  'client/components/Graph/Graph.js';
import * as selectors from '../../_redux/selectors'


import styles from './EwasmAnalyzer.scss';

const EwasmAnalyzer = ({ ewasmAnalyzer, contractName }) => {
  const [hasTabs, toggleTabs] = useState(false);
  const [opcodes, getFormattedOpcodes] = useState('');
  const [functionsCfg, getFunctionsCfg] = useState('');
  const [graphType, getGraphType] = useState('');
  const [graphId, getGraphId] = useState('');
  const data = ewasmAnalyzer.find(res => res.name === contractName).data;
  const typeCode = data.binary.sections.find(section => section.sectionType === 'Code');

  const onClick = (name, index) => {
    toggleTabs(true);
    getFormattedOpcodes(typeCode.payload.functions.find(item => item.name === name).formattedOpcodes);
    getFunctionsCfg(data.functionsCfg[index]);
    getGraphId(`functionsCfg--${index}`);
    getGraphType(`functionsCfgType--${index}`);
  }
  
  return (
    <div className={styles['analyzer']}>
      <Tab>
        <TabPanel className={styles['analyzer__tab-panel']} name='Summary'></TabPanel>
        <TabPanel className={styles['analyzer__tab-panel']} name='Function'>
          <SideBar className={styles['analyzer__sidebar']}>
          {!!typeCode &&
          typeCode.payload.functions.map((item, index) => {
            return (
              <SideBarItem key={item.name} className={styles['analyzer__sidebar__item']} label={item.name} onClick={() => onClick(item.name, index)} />
             )
          })}
          </SideBar>
          {
            hasTabs &&
            <Tab className={styles['analyzer__inner-tab']}>
              <TabPanel className={styles['analyzer__inner-tab-panel']} name='Opcodes'>
                {
                  !!opcodes &&
                  <div><pre>{opcodes}</pre></div>
                }
              </TabPanel>
              <TabPanel className={styles['analyzer__inner-tab-panel']} name='CFG'>
                <Graph
                  graphType={graphType}
                  graphId={graphId}
                  cfg={functionsCfg}
                /> 
              </TabPanel>
            </Tab>
          }
        </TabPanel>
        <TabPanel className={styles['analyzer__tab-panel']} name='Call Graph'>
          <Graph
            graphId={`callGraph--${contractName}`}
            graphType='CallGraph'
            cfg={data.dotCallGraph}
           />
        </TabPanel>
      </Tab>
    </div>
  )
}

EwasmAnalyzer.displayName = 'EwasmAnalyzer';

const mapStateToProps = state => ({
  ewasmAnalyzer: selectors.getEwasmAnalyzer(state)
})

export default connect(mapStateToProps, null)(EwasmAnalyzer);