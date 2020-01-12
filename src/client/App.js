import React from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

import * as actions from './_redux/actions.js';
import * as selectors from './_redux/selectors';

import TopNavBar from './components/TopNavBar/TopNavBar';
import Form from './components/Form/Form';
import Tab from './components/Tab/Tab';
import MessageComp from './components/MessageComp/MessageComp';
import TabPanel from './components/Tab/TabPanel/TabPanel';
import Main from './components/Main/Main';

import styles from './styles/App.scss';
import fade from './styles/transitions/fade.scss';
import scale from './styles/transitions/scale.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      parameter: '',
      isNewPanel: false,
      tabs: []
    }

    this.handleMenuItemIconClick = this.handleMenuItemIconClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchSolcVersions();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.contracts.length !== prevProps.contracts.length) {
      this.setState({
        tabs: this.props.contracts
      })
    }
  }

  handleMenuItemIconClick(index) {
    const { tabs } = this.state;
    const newTabs = tabs.filter((item, i) => i !== index);

    this.setState({
      tabs: newTabs,
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
    });

    this.props.getParameter(parameter);
    this.props.fetchContracts();
  }

  render() {
    const { isLoadingMessageOn, isErrorMessageOn, errorMessage, loadingMessage, versions } = this.props;
    const { tabs } = this.state;
    
    return (
      <div className={styles['app']}>
        <TopNavBar versions={versions}>
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
          { isLoadingMessageOn &&
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
          { isErrorMessageOn &&
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
          {!!tabs.length &&
          <Tab hasCloseIcon={true} onMenuItemIconClick={this.handleMenuItemIconClick} onTabItemClick={this.onTabItemClick}>
            {tabs.map((item, i) => {
              return (
                <TabPanel
                  key={`id--${item.name}--${i}`}
                  name={item.name}
                  >
                  <Main
                    id={`id--${item.name}--${i}`}
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

const mapStateToProps = state => ({
  isLoadingMessageOn: state.loadingMessage.isLoading,
  loadingMessage: state.loadingMessage.message,
  isErrorMessageOn: state.errorMessage.hasError,
  errorMessage: state.errorMessage.message,
  versions: selectors.getVersions(state),
  contracts: selectors.getContracts(state),
})

const mapDispatchToProps = {
  toggleLoadingMessage: actions.toggleLoadingMessage,
  toggleErrorMessage: actions.toggleErrorMessage,
  getParameter: actions.getParameter,
  fetchContracts: actions.fetchContracts,
  fetchSolcVersions: actions.fetchSolcVersions,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);;