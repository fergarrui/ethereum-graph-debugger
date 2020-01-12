import React from 'react';
import cx from 'classnames';

import TabMenuItem from './TabMenuItem/TabMenuItem';

import styles from './Tab.scss';

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

    const { children } = this.props;

    this.setState({
      currentTabIndex:
      index === children.length - 1  && index === this.state.currentTabIndex ? 0 
      : index === this.state.currentTabIndex ? index
      : this.state.currentTabIndex,
    });

    this.props.onMenuItemIconClick(index);
  }

  render() {
    const { currentTabIndex } = this.state;
    const { className } = this.props;

    const children = React.Children.map(this.props.children, (child, index) => {
      if(!!child) {
        return React.cloneElement(child, {
          index,
          active: index === currentTabIndex,
        });
      }
    });

    return (
      <div className={cx(styles['tab'], className)}ß>
        <div className={styles['tab__navigation']}>
          {React.Children.map(children, (child, i) => {
            return (
              <TabMenuItem
                key={`id--${child.props.name}`}
                name={child.props.name}
                active={currentTabIndex === i}
                onMenuItemClick={() => this.setActiveTab(i)}
                onIconClick={(e) => this.handleIconClick(e, i)}
              />
            )
          })}        
        </div>
        <div className={styles['tab__panels']}>
          { children }
        </div>
      </div>
    );
  }
}

export default Tab;

Tab.displayName = 'Tab';
