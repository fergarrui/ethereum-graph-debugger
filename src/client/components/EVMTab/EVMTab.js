import React from 'react';

import TabMenuItem from '../Tab/TabMenuItem/TabMenuItem';

import styles from '../../styles/Tab/Tab.scss';

class EVMTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.data != this.props.data) {
      this.setState({
        currentTabIndex: 0
      });
    }
  }
  setActiveTab(index) {
    this.setState({
      currentTabIndex: index,
    });
  }

  render() {
    const { data, children } = this.props;
    const { currentTabIndex } = this.state;

    const currentTab = React.Children.toArray(children).filter((child, i) => i === currentTabIndex);

    return (
      <div className={styles['tab']}>
        <div className={styles['tab__navigation']}>
        {data.map((item, i) => {
            return (
              <TabMenuItem
                evm={true}
                key={`id--${item.gas}`}
                name={i + 1}
                active={currentTabIndex === i}
                onClick={() => this.setActiveTab(i)}
              />
            )
          })}        
        </div>
          {currentTab}
      </div>
    );
  }
}

export default EVMTab;