import React from 'react';
import { connect } from 'react-redux';

import { showLoadingMessage, showErrorMessage, hideLoadingMessage, getErrorMessage } from '../Store/Actions.js';

import TopNavBar from '../TopNavBar/main.js';
import Tab from '../Tab/main.js';
import MessageComp from '../MessageComp/main.js';
import SettingsBar from '../SettingsBar/main.js';

import styles from '../../styles/App.scss';

const mapStateToProps = state => {
  return {
    showLoadingMessage: state.toggleLoadingMessage,
    showErrorMessage: state.toggleErrorMessage,
    errorMessage: state.toggleErrorMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadingMessageOn: () => dispatch(showLoadingMessage()),
    loadingMessageOff: () => dispatch(hideLoadingMessage()),
    errorMessageOn: () => dispatch(showErrorMessage()),
    getErrorMessage: message => dispatch(getErrorMessage(message)),
  }
}

class ConnectedApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      parameter: '',
      fetchRequestStatus: undefined,
      contracts: [],
      settingsVisible: false,
    }

    this.handleMenuItemIconClick = this.handleMenuItemIconClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleMenuItemIconClick(index) {
    const { contracts } = this.state;
    const newTabs = contracts.filter((item, i) => i !== index);

    this.setState({
      contracts: newTabs,
    });
  }

  handleInputChange(event) {

    const { value } = event.target;

    this.setState({
      inputValue: value,
      parameter: value,
    });
  }

  handleInputSubmit() {
    const { inputValue, parameter } = this.state;

    this.setState({
      parameter: inputValue,
      settingsVisible: false,
    });

    this.fetchData(parameter);
  }

  fetchData(parameter) {
    this.handleRequestPending();

    fetch(`http://localhost:9090/files/${encodeURIComponent(parameter) || ' '}?extension=sol`)
      .then(res => res.json())
      .then(data => {
        data.error 
        ? this.handleRequestFail(data.message) 
        : this.handleRequestSuccess(data);      
      })
      .catch(err => this.handleRequestFail(err))
      ;
  }

  handleRequestPending() {
    this.props.loadingMessageOn();
  }

  handleRequestSuccess(response) {
    this.setState({
      fetchRequestStatus: 'success',
      contracts: response,
    });

    this.props.loadingMessageOff();
  }

  handleRequestFail(message) {
    this.props.loadingMessageOff();
    this.props.errorMessageOn();
    this.props.getErrorMessage(message);
  }

  handleSettingsiconClick() {
    this.toggleOutsideClick();

    this.setState(prevState => ({
      settingsVisible: !prevState.settingsVisible,
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
    });
  }

  render() {

    const { fetchRequestStatus, contracts, settingsVisible, configPlaceholder } = this.state;
    const { children, showLoadingMessage, showErrorMessage, errorMessage } = this.props;

    return (
      <div className={styles['app']}>
        <TopNavBar
          onInputChange={(e) => this.handleInputChange(e)}
          onInputSubmit={() => this.handleInputSubmit()}
          onIconClick={() => this.handleSettingsiconClick()}
        />
        <div ref={node => { this.node = node; }}>
          <SettingsBar 
            active={!!settingsVisible}
            onSaveButtonClick={() => this.handleSettingsSaveButtonClick()}
          />
        </div>
        { showLoadingMessage &&
          <MessageComp message='Loading...' />
        }
        { showErrorMessage &&
          <MessageComp 
            message={errorMessage}
            onMessageButtonClick={() => this.handleMessageButtonClick()}
           />
        }
        <div className={styles['app__tabs']}>
          {fetchRequestStatus === 'success' && 
          <Tab data={contracts} onMenuItemIconClick={this.handleMenuItemIconClick}>
            {children}
          </Tab>        
          }
        </div>
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

App.displayName = 'App';

export default App;