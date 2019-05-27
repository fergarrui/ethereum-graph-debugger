import React from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { showLoadingMessage, showErrorMessage, hideLoadingMessage, getErrorMessage } from './components/Store/Actions.js';

import TopNavBar from './components/TopNavBar/TopNavBar';
import Form from './components/Form/Form';
import Tab from './components/Tab/Tab';
import MessageComp from './components/MessageComp/MessageComp';
import SettingsBar from './components/SettingsBar/SettingsBar';
import Dropdown from './components/Dropdown/Dropdown';
import Version from './components/Version/Version';

import styles from './styles/App.scss';
import fade from './styles/transitions/fade.scss';
import scale from './styles/transitions/scale.scss';

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      parameter: '',
      fetchRequestStatus: undefined,
      contracts: [],
    }
  }

  componentDidMount() {
    this.fetchData('http://localhost:9090/solc/list');
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

    const url = `http://localhost:9090/files/${encodeURIComponent(parameter) || ' '}?extension=sol`;
    this.fetchData(url);
  }

  fetchData(url) {
    this.handleRequestPending();

    fetch(url)
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

    if(response.some(item => item.version)) {
      this.setState({
        fetchRequestStatus: 'success',
        versions: response,
      });
    } else {
      this.setState({
        fetchRequestStatus: 'success',
        contracts: response,
      });
    }

    this.props.loadingMessageOff();
  }

  handleRequestFail(message) {
    this.props.loadingMessageOff();
    this.props.errorMessageOn();
    this.props.getErrorMessage(message);
  }

  render() {

    const { fetchRequestStatus, contracts, versions } = this.state;
    const { children, showLoadingMessage, showErrorMessage, errorMessage } = this.props;

    return (
      <div className={styles['app']}>
        <TopNavBar
          fetchRequestStatus={fetchRequestStatus}
          versions={versions}>
          <Form 
            submitButton={true}
            inputTypes={[{ name: 'contractsPath', placeholder: 'Insert contracts path'}]}
            buttonValue='Load contracts from URI'
            onInputChange={(e) => this.handleInputChange(e)}
            onSubmitForm={() => this.handleInputSubmit()}
            onInputKeyUp={() => this.handleInputSubmit()}
            />
        </TopNavBar>
        <CSSTransitionGroup
          transitionName={fade}
          transitionAppear={true}
          transitionAppearTimeout={300}
          trnasitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          >
          { showLoadingMessage &&
            <MessageComp message='Loading...' />
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName={fade}
          transitionAppear={true}
          transitionAppearTimeout={300}
          trnasitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          >
          { showErrorMessage &&
            <MessageComp 
              message={errorMessage}
              onMessageButtonClick={() => this.handleMessageButtonClick()}
            />
          }
        </CSSTransitionGroup>
        <div className={styles['app__tabs']}>
          <CSSTransitionGroup
            transitionName={scale}
            transitionAppear={true}
            transitionAppearTimeout={300}
            trnasitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            >
          {fetchRequestStatus === 'success' && contracts.length &&
          <Tab data={contracts} onMenuItemIconClick={this.handleMenuItemIconClick}>
            {children}
          </Tab>        
          }
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

App.displayName = 'App';

export default connect(mapStateToProps, mapDispatchToProps)(App);;