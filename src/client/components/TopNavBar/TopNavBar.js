import React from 'react';
import { connect } from 'react-redux';

import Icon from '../Icon/Icon';
import SettingsBar from '../SettingsBar/SettingsBar';
import Version from '../Version/Version';
import Dropdown from '../Dropdown/Dropdown';

import styles from './TopNavBar.scss';

const mapStateToProps = state => ({
  versionNumber: state.versions.versionNumber,
  postedVersions: state.versions.postedVersions,
  hasFetched: state.versions.hasFetched,
});

class TopNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsVisible: false,
      versionsVisible: false
    }

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleSettingsIconClick() {
    this.toggleOutsideClick();

    this.setState(prevState => ({
      settingsVisible: !prevState.settingsVisible,
      versionsVisible: false,
    }))
  }

  handleSettingsSaveButtonClick() {
    this.toggleOutsideClick();

    this.setState({
      settingsVisible: false,
    });
  }

  toggleOutsideClick() {
    if (!this.state.settingsVisible) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    document.removeEventListener('click', this.handleOutsideClick);
  
    this.setState({
      settingsVisible: false,
      versionsVisible: false,
    });
  }

  handleVersionsButtonClick() {    
    this.toggleOutsideClick();

    this.setState( prevState => ({
      versionsVisible: !prevState.versionsVisible,
      settingsVisible: false,
    }));
  }

  handleVersionItemClick() {

    this.setState({
      versionsVisible: false,
    });
  }

  render() {
    const { settingsVisible, versionsVisible } = this.state;
    const { versions, children, versionNumber, hasFetched } = this.props;

    return (
      <div className={styles['top-navbar']}>
        <div className={styles['top-navbar__form']}>
          {children}
        </div>
        <div className={styles['top-navbar__versions-dropdown']}>
          {
            hasFetched &&
            <div className={styles['top-navbar__versions-dropdown__text']}>
              <span>{versionNumber}</span>
            </div>
          }
          <button className={styles['top-navbar__versions-dropdown__toggler']} onClick={() => this.handleVersionsButtonClick()}>
            <span>Change solc version</span>
          </button>
          <Dropdown active={!!versionsVisible}>
          { !!versions.length 
            ? <Version data={versions} onVersionItemClick={() => this.handleVersionItemClick()} />
            : <div><span style={{ color: '#fff'}}>{`Couldn't load versions`}</span></div>
          }
          </Dropdown>
        </div>
        <div className={styles['top-navbar__settings-dropdown']}>
          <Icon onClick={() => this.handleSettingsIconClick()} iconName='Cogs' />
          <div ref={node => { this.node = node; }}>
            <Dropdown active={settingsVisible} settings>
              <SettingsBar onSaveButtonClick={() => this.handleSettingsSaveButtonClick()} />
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}

TopNavBar.displayName = 'TopNavBar';

export default connect(mapStateToProps)(TopNavBar);
