import React from 'react';
import { connect } from 'react-redux';
import { postContract } from '../Store/Actions';

import Form from '../Form/Form';

import styles from './Execute.scss';

const mapStateToProps = state => ({
  contracts: state.contracts.contracts
})

const mapDispatchToProps = dispatch => ({
  postContract: contract => dispatch(postContract(contract))
});

class Execute extends React.Component {
  constructor(props) {
    super(props);    
  }

  handleInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
    });
  }

  handleKeyDown(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    event.preventDefault();

    if(event.keyCode !== 13) {
      return;
    }

    this.handleSubmit();
  }

  handleSubmit() {    
    const { name, gas } = this.state;
    const { contractPath, contractCode, postContract } = this.props;

    console.log('submitted');

    postContract({ 
      name, 
      path: contractPath,
      gas,
      source: contractCode 
    });
  }


  render() {

    const { executeResponse, contracts } = this.props;
    console.log(contracts);

    const inputTypes = [
      { name: 'contractAddress', placeholder: 'Contract Address' },
      { name: 'gas', placeholder: 'Gas' },
      { name: 'gasValue', placeholder: 'Gas Value' },
      { name: 'price', placeholder: 'Price' }
    ];

    return (
      <div className={styles['execute']}>
        <Form 
          inputTypes={inputTypes}
          onInputChange={(e) => this.handleInputChange(e)}
          onInputKeyUp={() => this.handleSubmit()}
          row
        />
        {
          executeResponse.map(item => {
            return (
              <Form 
                key={`id--${item.name}`} 
                inputTypes={executeResponse}
                submitButton
                blue={item.type === 'constructor'}
                yellow={!!item.constant}
                buttonValue={item.type === 'constructor' ? 'constructor' : item.name}
                onInputChange={(e) => this.handleInputChange(e)} 
                onSubmitForm={() => this.handleSubmit()}
                onInputKeyUp={() => this.handleSubmit()}
              />
            )
          })
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Execute);