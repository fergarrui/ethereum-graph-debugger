import React from 'react';

import TabMenuItem from '../Tab/TabMenuItem/main';
import EVMTabPanel from './EVMTabPanel';

import styles from '../../styles/Tab/Tab.scss';

class EVMTab extends React.Component {
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

    console.log(data)

    return (
      <div className={styles['tab']}>
        <div className={styles['tab__navigation']}>
        {data.map((item, i) => {
            return (
              <TabMenuItem
                key={`id--${item.gas}`}
                name={i + 1}
                active={currentTabIndex === i}
                onClick={() => this.setActiveTab(i)}
              />
            )
          })}        
        </div>
        { data.map((item, i) => {
          return (
            <EVMTabPanel 
              key={`id--${item.gas}`}
              active={currentTabIndex === i}
              evmData={item} />
          )
        }) 
      }
      </div>
    );
  }
}

export default EVMTab;