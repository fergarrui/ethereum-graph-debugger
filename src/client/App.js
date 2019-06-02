import React from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { showLoadingMessage, showErrorMessage, hideLoadingMessage } from './components/Store/Actions.js';

import { baseUrl } from './utils/baseUrl';

import TopNavBar from './components/TopNavBar/TopNavBar';
import Form from './components/Form/Form';
import Tab from './components/Tab/Tab';
import MessageComp from './components/MessageComp/MessageComp';
import TabPanel from './components/Tab/TabPanel/TabPanel';
import Main from './components/Main/Main';

import styles from './styles/App.scss';
import fade from './styles/transitions/fade.scss';
import scale from './styles/transitions/scale.scss';

const mapStateToProps = state => {
  return {
    showLoadingMessage: state.loadingMessage.isLoading,
    loadingMessage: state.loadingMessage.message,
    showErrorMessage: state.errorMessage.hasError,
    errorMessage: state.errorMessage.message
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadingMessageOn: message => dispatch(showLoadingMessage(message)),
    loadingMessageOff: () => dispatch(hideLoadingMessage()),
    errorMessageOn: message => dispatch(showErrorMessage(message)),
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

    this.handleMenuItemIconClick = this.handleMenuItemIconClick.bind(this);
  }

  componentDidMount() {
    this.fetchData(baseUrl + 'solc/list');
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
    this.props.loadingMessageOn('Loading...');
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
    this.props.errorMessageOn(message);
  }

  render() {

    const { fetchRequestStatus, contracts, versions } = this.state;
    const { showLoadingMessage, showErrorMessage, errorMessage, loadingMessage } = this.props;

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
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          >
          { showLoadingMessage &&
            <MessageComp message={loadingMessage} />
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName={fade}
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
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
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            >
          {fetchRequestStatus === 'success' && contracts.length &&
          <Tab onMenuItemIconClick={this.handleMenuItemIconClick}>
            {contracts.map((item, i) => {
              return (
                <TabPanel
                  key={`id--${item.name}--${i}`}
                  name={item.name}
                  >
                  <Main 
                    name={item.name}
                    code={item.code}
                    path={item.path}
                    index={i}
                    />
                </TabPanel>
              )
            })}    
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