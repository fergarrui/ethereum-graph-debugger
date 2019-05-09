import React from 'react';

import TabMenuItem from './TabMenuItem/TabMenuItem';
import TabPanel from './TabPanel/TabPanel';

import styles from '../../styles/Tab/Tab.scss';

class Tab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: 0,
    }
  }

  setActiveTab(index) {
    this.setState({
      currentTabIndex: index,
    });
  }

  handleIconClick(event, index) {
    event.stopPropagation();

    const { data } = this.props;

    this.setState({
      currentTabIndex:
      index === data.length - 1  && index === this.state.currentTabIndex ? 0 
      : index === this.state.currentTabIndex ? index  
      : this.state.currentTabIndex,
    });

    this.props.onMenuItemIconClick(index);
  }

  render() {
    const { data } = this.props;
    const { currentTabIndex } = this.state;

    return (
      <div className={styles['tab']}>
        <div className={styles['tab__navigation']}>
          {data.map((item, i) => {
            return (
              <TabMenuItem
                key={`id--${item.name}`}
                name={item.name}
                active={currentTabIndex === i}
                onClick={() => this.setActiveTab(i)}
                onIconClick={(e) => this.handleIconClick(e, i)}
              />
            )
          })}        
        </div>
        <div className={styles['tab__panels']}>
          {data.map((item, i) => {
            return (
              <TabPanel
                key={`id--${item.name}`}
                name={item.name}
                code={item.code}
                index={i}
                active={currentTabIndex === i}
                path={item.path}>
              </TabPanel>
            )
          })}    

        </div>
      </div>
    );
  }
}

export default Tab;

Tab.displayName = 'Tab';
