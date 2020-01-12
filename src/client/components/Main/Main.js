import React from 'react';

import { connect } from 'react-redux';
import  { CSSTransitionGroup } from 'react-transition-group';

import * as actions from '../../_redux/actions.js';
import * as selectors from '../../_redux/selectors';
import { baseUrl } from '../../utils/baseUrl';
import Editor from '../Editor/Editor';
import { SideBar, SideBarItem } from '../SideBar/SideBar';
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

const mapStateToProps = state => ({
  evm: state.selectEVMState,
  tabs: selectors.getTabs(state),
  hasFetched: selectors.getHasToolFetched(state),
  isLoading: selectors.getToolIsLoading(state)
})

const mapDispatchToProps = {
  fetchTransactionDebugger: actions.fetchTransactionDebugger,
  fetchStorage: actions.fetchStorage,
  fetchControlFlowGraph: actions.fetchControlFlowGraph,
  fetchDisassembler: actions.fetchDisassembler,
  fetchAnalyzer: actions.fetchAnalyzer,
  toggleErrorMessage: actions.toggleErrorMessage,
  filterTabs: actions.filterTabs
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSideBarOpen: false,
      hasUpdated: false,
      isModalOpen: {
        transactionDebugger: false,
        viewStorage: false,
        analyzer: false
      },
      displayedTabs: []
    }

    this.handleMenuItemIconClick = this.handleMenuItemIconClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { name, tabs } = this.props;

    if(tabs !== prevProps.tabs) {
      this.setState({
        displayedTabs: tabs.filter(tab => tab.name === name)
      })
    }
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

  handleTransactionFormSubmit() {
    const { name, path, code } = this.props;
    const { isModalOpen } = this.state;

    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path),
      blockchainHost: localStorage.getItem('host'),
      blockchainProtocol: localStorage.getItem('protocol'),
      blockchainBasicAuthUsername: localStorage.getItem('username'),
      blockchainBasicAuthPassword: localStorage.getItem('password')
    }

    this.props.fetchTransactionDebugger(name, this.getUrl(`debug/${this.state.transactionHash}/`, params), 'Transaction Debugger', code);
    this.setState({
      isModalOpen: { ...isModalOpen, transactionDebugger: false }
    });
  }

  handleFormInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
    });
  }

  handleSubmitViewStorageForm() {
    const { name } = this.props;
    const params = {
      startBlock: encodeURIComponent(this.state.startBlock),
      endBlock: encodeURIComponent(this.state.endBlock)
    }

    this.props.fetchStorage(name, this.getUrl(`storage/${this.state.contractAddress}/`, params), 'Storage Viewer');
    this.setState({
      isModalOpen: { ...this.state.isModalOpen, viewStorage: false }
    })

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMenuIconClick() {
    if (!this.state.isSideBarOpen) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
    }

    this.setState(prevState => ({
      isSideBarOpen: !prevState.isSideBarOpen,
    }));
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    document.removeEventListener('click', this.handleOutsideClick);
  
    this.setState({
      isSideBarOpen: false,
    });
  }

  handleControlFlowGraphClick(isConstructor) {
    const { name, path, code } = this.props;
    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path),
      'constructor': `${isConstructor}`
    }

    this.props.fetchControlFlowGraph(name, this.getUrl('cfg/source', params), `Control Flow Graph ${isConstructor ? 'Constructor' : 'Runtime'}`, code);

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleAnalyzerClick() {
    this.setState({
      isModalOpen: { ...this.state.isModalOpen, analyzer: true }
    });
  }

  handleDisassemblerClick() {
    const { name, code, path } = this.props;

    const params = {
      name: name.replace('.sol', '').replace('.evm', ''),
      path: encodeURIComponent(path)
    }

    this.props.fetchDisassembler(name, this.getUrl('disassemble', params), 'Disassembler', code);

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleViewStorageClick() {
    this.setState({
      isModalOpen: {...this.state.isModalOpen, viewStorage: true },
      isSideBarOpen: false,
    });

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMenuItemIconClick(index) {
    this.props.filterTabs(index);
    const newTabs = this.state.displayedTabs.filter((item, i) => i !== index)
    this.setState({
      displayedTabs: newTabs
    });
  }

  handleModalIconClick() {
    this.setState({
      isModalOpen: { ...this.state.isModalOpen, transactionDebugger: false, viewStorage: false } 
    });
  }

  handleTransactionDebuggerClick() {
    this.setState({
      isModalOpen: {...this.state.isModalOpen, transactionDebugger: true},
      isSideBarOpen: false,
    });

    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleMessageButtonClick() {
    this.setState({
      messageVisible: false,
    });
  }

  handleSubmitEwasmForm() {
    const { name } = this.props;
    const { ewasmContractAddress } = this.state;

    if(!!ewasmContractAddress) {
      this.props.fetchAnalyzer(name, `${baseUrl}ewasm/analyze/${ewasmContractAddress}/`, 'Ewasm Analyzer');
    } else {
      actions.toggleErrorMessage(true, `Contract address must be defined`)
    }

    this.setState({
      isModalOpen: { ...this.state.isModalOpen, analyzer: false }
    })
  }

  render() {
    const { code, name, path, index, evm, hasFetched } = this.props;
    const { isSideBarOpen, isModalOpen, displayedTabs } = this.state;

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
      'main-comp__left__side-bar--open': !!isSideBarOpen,
    });

    return (
      <div className={styles['main-comp']}>
        <div className={styles['main-comp__left']}>
        <div className={styles['main-comp__left__control']}>
          <button onClick={() => this.handleMenuIconClick()}>
            <Hamburger clicked={!!isSideBarOpen} />
          </button>
        </div>
        <div 
          className={sideBarClasses}
          ref={node => { this.node = node; }}
        >
          <SideBar>
            <SideBarItem label='Transaction Debugger' onClick={() => this.handleTransactionDebuggerClick()} />
            <SideBarItem label='Disassembler' onClick={() => this.handleDisassemblerClick()} />
            <SideBarItem label='Control Flow Graph Constructor' onClick={() => this.handleControlFlowGraphClick(true)} />
            <SideBarItem label='Control FLow Graph Runtime' onClick={() => this.handleControlFlowGraphClick(false)} />
            <SideBarItem label='View Storage' onClick={() => this.handleViewStorageClick()} />
            <SideBarItem label='Ewasm Analyzer' onClick={() => this.handleAnalyzerClick()} />
          </SideBar> 
        </div>
        <div className={styles['main-comp__left__data']}>
            <Editor code={code} index={index} />
            {
              evm && 
              <Tab hasCloseIcon={false}>
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
            <Tab hasCloseIcon={true} onMenuItemIconClick={this.handleMenuItemIconClick} onTabItemClick={this.onTabItemClick}>
            {!!hasFetched && !!displayedTabs.length && displayedTabs.map((item, i) => {
              return (
                <TabPanel
                  key={`id--${item.name}`}
                  name={item.title}>
                  <Panel
                    contractName={name}
                    contractCode={code}
                    contractPath={path}
                    type={item.type}
                    />
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
          isModalOpen.transactionDebugger &&  
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
            isModalOpen.analyzer &&
            <Modal onIconClick={() => this.handleModalIconClick()}>          
                <Form
                  buttonValue='Submit'
                  submitButton={true} 
                  inputTypes={[{ name: 'ewasmContractAddress', placeholder: 'Contract address' }]}
                  onInputChange={(e) => this.handleFormInputChange(e)} 
                  onSubmitForm={() => this.handleSubmitEwasmForm()}
                  onInputKeyUp={() => this.handleSubmitEwasmForm()}
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
            isModalOpen.viewStorage &&  
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