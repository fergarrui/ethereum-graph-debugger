import React from 'react';

import { connect } from 'react-redux';
import  { CSSTransitionGroup } from 'react-transition-group';

import { showLoadingMessage, hideLoadingMessage, showErrorMessage } from '../Store/Actions.js';

import baseurl, { baseUrl } from '../../utils/baseUrl';

import Editor from '../Editor/Editor';
import SideBar from '../SideBar/SideBar';
import Tab from '../Tab/Tab';
import Modal from '../Modal/Modal';
import Hamburger from '../Hamburger/Hamburger';
import TabPanel from '../Tab/TabPanel/TabPanel';
import Panel from '../Panel/Panel';
import EVMState from '../EVMState/EVMState';
import Form from '../Form/Form';

import styles from './Main.scss';
import fade from '../../styles/transitions/fade.scss';
import scale from '../../styles/transitions/scale.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const mapStateToProps = state => {
  return {
    evm: state.selectEVMState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadingMessageOn: () => dispatch(showLoadingMessage()),
    loadingMessageOff: () => dispatch(hideLoadingMessage()),
    errorMessageOn: message => dispatch(showErrorMessage(message)),
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sideBarOpen: false,
      modalOpen: {
        transactionDebugger: false,
        viewStorage: false
      },
      inputValue: '',
      prameter: '',
      tabs: [],
      cfg: '',
      operations: [],
      trace: {},
      fetchRequestStatus: undefined,
    }

    this.handleMenuItemIconClick = this.handleMenuItemIconClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  getUrl(endPoint, parameters) {
    let url = baseUrl + endPoint;
    const paramKeys = Object.keys(parameters);

    if (paramKeys.length) {
      url += '?';
    }
    url += paramKeys.filter(key => parameters[key]).map( key=> `${key}=${parameters[key]}`).join('&');
    return url;
  }

 fetchData(url, type, body) {
   this.handleRequestPending();

  fetch(url, body ? {
    body: JSON.stringify({ request: body }),
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    }
    } : {})
    .then(res => res.json())
    .then(data => {
      data.error
      ? this.handleRequestFail(data)
      : this.handleRequestSuccess(data, type);
    })
    .catch(err => this.handleRequestFail(err));
  }

  handleRequestPending() {
    this.setState({
      modalOpen: {...this.state.modalOpen, transactionDebugger: false, viewStorage: false },
      sideBarOpen: false,
    });

    this.props.loadingMessageOn('Loading...');
  }


  handleRequestSuccess(response, type) {
    const newTabs = [...this.state.tabs, {'title': type, 'type': type}];
    
    if(type === 'Disassembler') {
      this.setState({
        disassemblerResponse: response,
      });
    }

    if(type === 'Transaction Debugger') {
      this.setState({
        debuggerResponse: response,
      });
    }

    if(type === 'Control Flow Graph Constructor' || 'Control Flow Graph Runtime') {
      this.setState({
        graphResponse: response,
      });
    }

    if(type === 'Storage Viewer') {
      this.setState({
        storageResponse: response,
      });
    }

    this.setState({
      fetchRequestStatus: 'success',
      tabs: newTabs,
      sideBarOpen: false,
    }); 

    this.props.loadingMessageOff();
  }

  handleRequestFail(data) {
    this.props.loadingMessageOff();
    this.props.errorMessageOn(data.message);
  }

  handleTransactionFormSubmit() {
    const { name, path, code } = this.props;

    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path),
      blockchainHost: localStorage.getItem('host'),
      blockchainProtocol: localStorage.getItem('protocol'),
      blockchainBasicAuthUsername: localStorage.getItem('username'),
      blockchainBasicAuthPassword: localStorage.getItem('password')
    }

    this.fetchData(this.getUrl(`debug/${this.state.transactionHash}/`, params), 'Transaction Debugger', code);
  }

  handleFormInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
    });
  }

  handleSubmitViewStorageForm() {
    const params = {
      startBlock: encodeURIComponent(this.state.startBlock),
      endBlock: encodeURIComponent(this.state.endBlock)
    }

    this.fetchData(this.getUrl(`storage/${this.state.contractAddress}/`, params), 'Storage Viewer');

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMenuIconClick() {
    if (!this.state.sideBarOpen) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
    }

    this.setState(prevState => ({
      sideBarOpen: !prevState.sideBarOpen,
    }));
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    document.removeEventListener('click', this.handleOutsideClick);
  
    this.setState({
      sideBarOpen: false,
    });
  }

  handleControlFlowGraphClick(isConstructor) {
    const { name, path, code } = this.props;
    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path),
      'constructor': `${isConstructor}`
    }
    this.fetchData(this.getUrl('cfg/source', params), `Control Flow Graph ${isConstructor ? 'Constructor' : 'Runtime'}`, code);

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleDisassemblerClick() {
    const { name, code, path } = this.props;

    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path)
    }
    this.fetchData(this.getUrl('disassemble', params), 'Disassembler', code);

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleViewStorageClick() {
    this.setState({
      modalOpen: {...this.state.modalOpen, viewStorage: true },
      sideBarOpen: false,
    });

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMenuItemIconClick(index) {
    const newTabs = this.state.tabs.filter((item, i) => i !== index);

    this.setState({
      tabs: newTabs,
    });
  }

  handleModalIconClick() {

    this.setState({
      modalOpen: { ...this.state.modalOpen, transactionDebugger: false, viewStorage: false } 
    });
  }

  handleTransactionDebuggerClick() {
    this.setState({
      modalOpen: {...this.state.modalOpen, transactionDebugger: true},
      sideBarOpen: false,
    });

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMessageButtonClick() {
    this.setState({
      messageVisible: false,
    });
  }

  render() {
    const { code, name, path, index, evm } = this.props;
    const { tabs, sideBarOpen, disassemblerResponse, graphResponse, debuggerResponse, storageResponse, modalOpen, } = this.state;

    const inputTypes = [
      {
        name: 'contractAddress',
        placeholder: 'Enter contract address'
      },
      {
        name: 'startBlock',
        placeholder: 'Start block'
      },
      {
        name: 'endBlock',
        placeholder: 'End block'
      }
    ]

    const sideBarClasses = cx({
      'main-comp__left__side-bar': true,
      'main-comp__left__side-bar--open': !!sideBarOpen,
    });

    return (
      <div className={styles['main-comp']}>
        <div className={styles['main-comp__left']}>
        <div className={styles['main-comp__left__control']}>
          <button onClick={() => this.handleMenuIconClick()}>
            <Hamburger clicked={!!sideBarOpen} />
          </button>
        </div>
        <div 
          className={sideBarClasses}
          ref={node => { this.node = node; }}
        > 
          <SideBar 
            onDisassemblerClick={() => this.handleDisassemblerClick()}
            onTransactionDebuggerClick={() => this.handleTransactionDebuggerClick()}
            onControlFlowGraphRuntimeClick={() => this.handleControlFlowGraphClick(false)}
            onControlFlowGraphConstructorClick={() => this.handleControlFlowGraphClick(true)}
            onViewStorageClick={() => this.handleViewStorageClick()}
          />
        </div>
        <div className={styles['main-comp__left__data']}>
            <Editor code={code} index={index} />
            {
              evm && 
              <Tab>
                {
                  evm.map((item, i) => {
                    return (
                      <TabPanel 
                        name={i + 1} 
                        key={`id--${item.gas}`}>
                          <EVMState evm={item} />
                      </TabPanel>
                    )
                  })
                }
              </Tab>
            }
        </div>
      </div>
      <div className={styles['main-comp__right']}>
        <CSSTransitionGroup
          transitionName={scale}
          transitionAppear={true}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          >
            <Tab onMenuItemIconClick={this.handleMenuItemIconClick} 
            >
            {tabs.map((item, i) => {
              return (
                <TabPanel
                  key={`id--${item.name}`}
                  name={item.title}>
                  <Panel
                    contractName={name}
                    contractCode={code}
                    contractPath={path}
                    type={item.type}
                    disassemblerResponse={disassemblerResponse}
                    debuggerResponse={debuggerResponse}
                    graphResponse={graphResponse}
                    storageResponse={storageResponse} />
                </TabPanel>
              )
            })}
            </Tab>
        </CSSTransitionGroup>
      </div>
      <CSSTransitionGroup
        transitionName={fade}
        transitionAppear={true}
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        >
        {
          modalOpen.transactionDebugger &&  
            <Modal onIconClick={() => this.handleModalIconClick()}>          
              <Form
                submitButton={true}
                inputTypes={[{ name: 'transactionHash', placeholder: 'Transaction Hash' }]}
                buttonValue='Debug'
                onInputChange={(e) => this.handleFormInputChange(e)}
                onInputKeyUp={() => this.handleTransactionFormSubmit()}
                onSubmitForm={() => this.handleTransactionFormSubmit()}
                />
            </Modal>
        }
      </CSSTransitionGroup>
      <CSSTransitionGroup
        transitionName={fade}
        transitionAppear={true}
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        >
          {
            modalOpen.viewStorage &&  
              <Modal onIconClick={() => this.handleModalIconClick()}>          
                <Form
                  buttonValue='Submit'
                  submitButton={true} 
                  inputTypes={inputTypes}
                  onInputChange={(e) => this.handleFormInputChange(e)} 
                  onSubmitForm={() => this.handleSubmitViewStorageForm()}
                  onInputKeyUp={() => this.handleSubmitViewStorageForm()}
                  />
              </Modal>
          }
          </CSSTransitionGroup>
        </div>
    )
  }
}

Main.displayName = 'Main';

export default connect(mapStateToProps, mapDispatchToProps)(Main);