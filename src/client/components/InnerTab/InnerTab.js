import React from 'react';

import TabMenuItem from '../Tab/TabMenuItem/TabMenuItem';
import InnerTabPanel from './InnerTabPanel/InnerTabPanel';

import styles from '../Tab/Tab.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

class InnerTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentInnerTabIndex: 0,
    }
  }

  setActiveInnerTab(index) {
    this.setState({
      currentInnerTabIndex: index,
    });
  }


  handleIconClick(event, index) {
    event.stopPropagation();

    const { data } = this.props;

    this.setState({
        currentInnerTabIndex: index === data.length - 1  && index === this.state.currentInnerTabIndex ? 0 
        : index === this.state.currentInnerTabIndex ? index  
        : this.state.currentInnerTabIndex
    });


    this.props.onMenuItemIconClick(index);
  }


  render() {

    const { data, contractName, contractCode, contractPath, disassemblerResponse, graphResponse, debuggerResponse } = this.props;
    const { currentInnerTabIndex } = this.state;

    return (
      <div className={styles['tab']}>
        <div className={styles['tab__navigation']}>
          {data.map((item, i) => {
            return (
              <TabMenuItem 
                key={`id--${item.name}`}  
                title={item.title}
                active={currentInnerTabIndex === i}
                onClick={() => this.setActiveInnerTab(i)}
                onIconClick={(e) => this.handleIconClick(e, i)}
              />
            )
          })}
        </div>
        <div className={styles['tab__panels']}>
          {data.map((item, i) => {
            return (
              <InnerTabPanel
                key={`id--${item.name}`}  
                type={item.type}
                active={currentInnerTabIndex === i}
                contractName={contractName}
                contractCode={contractCode}
                contractPath={contractPath}
                disassemblerResponse={disassemblerResponse}
                debuggerResponse={debuggerResponse}
                graphResponse={graphResponse}
             />
            )
          })}
        </div>
      </div>
    );
  }
}

export default InnerTab;

InnerTab.displayName = 'InnerTab';
