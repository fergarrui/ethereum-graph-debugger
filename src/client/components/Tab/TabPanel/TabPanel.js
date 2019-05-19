import React from 'react';
import { connect } from 'react-redux';
import  { CSSTransitionGroup } from 'react-transition-group';

import { showLoadingMessage, hideLoadingMessage, showErrorMessage, getErrorMessage } from '../../Store/Actions.js';

import Editor from '../../Editor/Editor';
import SideBar from '../../SideBar/SideBar';
import InnerTab from '../../InnerTab/InnerTab';
import Modal from '../../Modal/Modal';
import Hamburger from '../../Hamburger/Hamburger';
import EVMTab from '../../EVMTab/EVMTab';
import EVMTabPanel from '../../EVMTab/EVMTabPanel';
import EVMState from '../../EVMState/EVMState';
import Form from '../../Form/Form';

import styles from './TabPanel.scss';
import fade from '../../../styles/transitions/fade.scss';
import scale from '../../../styles/transitions/scale.scss';

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
    errorMessageOn: () => dispatch(showErrorMessage()),
    getErrorMessage: message => dispatch(getErrorMessage(message)),
  }
}

class TabPanel extends React.Component {
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
    let url = `http://localhost:9090/${endPoint}`;
    const paramKeys = Object.keys(parameters);

    if (paramKeys.length) {
      url += '?';
    }
    url += paramKeys.filter(key => parameters[key]).map( key=> `${key}=${parameters[key]}`).join('&');
    return url;
  }

 fetchData(url, type, body) {
   this.handleRequestPending();
  fetch(url, body? {
      body: JSON.stringify({request: body}),
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      }
    }: {})
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

    this.props.loadingMessageOn();
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

    if(type === 'Control Flow Graph') {
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
    const message = data.message
    this.props.loadingMessageOff();
    this.props.errorMessageOn();
    this.props.getErrorMessage(message);
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

  handleControlFlowGraphClick() {
    const { name, path, code } = this.props;

    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path),
      'constructor': 'false'
    }
    this.fetchData(this.getUrl('cfg/source', params), 'Control Flow Graph', code);

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
    
    const { code, name, path, active, index, children, evm } = this.props;
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

    const tabPanelClasses = cx({
      'tab-panel': true,
      'tab-panel--active': !!active,
    });

    const sideBarClasses = cx({
      'tab-panel__left__side-bar': true,
      'tab-panel__left__side-bar--open': !!sideBarOpen,
    });
    
    return (
      <div className={tabPanelClasses}>
        <div className={styles['tab-panel__left']}>
          <div className={styles['tab-panel__left__control']}>
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
              onControlFlowGraphClick={() => this.handleControlFlowGraphClick()}
              onViewStorageClick={() => this.handleViewStorageClick()}
            />
          </div>
          <div className={styles['tab-panel__left__data']}>
              <Editor code={code} index={index} />
              {
                evm && 
                <EVMTab data={evm}>
                  {
                    evm.map(item => {
                      return (
                        <EVMTabPanel key={`id--${item.gas}`}>
                          <EVMState evm={item} />
                        </EVMTabPanel>
                      )
                    })
                  }
                </EVMTab>
              }
          </div>
        </div>
        <div className={styles['tab-panel__right']}>
          <CSSTransitionGroup
            transitionName={scale}
            transitionAppear={true}
            trnasitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            >
              <InnerTab 
                data={tabs} 
                contractName={name}
                contractCode={code}
                contractPath={path}
                graphResponse={graphResponse}
                debuggerResponse={debuggerResponse}
                disassemblerResponse={disassemblerResponse}
                storageResponse={storageResponse}
                onMenuItemIconClick={this.handleMenuItemIconClick} 
              >
              {children}
            </InnerTab>
          </CSSTransitionGroup>
        </div>
        <CSSTransitionGroup
          transitionName={fade}
          transitionAppear={true}
          transitionAppearTimeout={300}
          trnasitionEnterTimeout={300}
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
          trnasitionEnterTimeout={300}
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

TabPanel.displayName = 'TabPanel';

export default connect(mapStateToProps, mapDispatchToProps)(TabPanel);;
