import React from 'react';
import { connect } from 'react-redux';

import Tab from '../Tab/Tab';
import TabPanel from '../Tab/TabPanel/TabPanel';
import { SideBar, SideBarItem } from '../SideBar/SideBar';

import * as selectors from '../../_redux/selectors';

import styles from './EwasmAnalyzer.scss';

const EwasmAnalyzer = ({ ewasmAnalyzer, contractName }) => {
  const data = ewasmAnalyzer.find(res => res.name === contractName).data;
  const typeCode = data.sections.find(section => section.sectionType === 'Code');
  return (
    <div className={styles['analyzer']}>
      <Tab>
        <TabPanel name='Summary'></TabPanel>
        <TabPanel name='Function'>
          <SideBar className={styles['analyzer__sidebar']}>
          {!!typeCode &&
          typeCode.payload.functions.map(item => {
            return (
              <SideBarItem className={styles['analyzer__sidebar__item']} label={item.name} onClick={console.log('clicked')} />
             )
          })}
          </SideBar>
        </TabPanel>
        <TabPanel name='Call Graph'></TabPanel>
      </Tab>
    </div>
  )
}

const mapStateToProps = state => ({
  ewasmAnalyzer: selectors.getEwasmAnalyzer(state)
})

export default connect(mapStateToProps, null)(EwasmAnalyzer);