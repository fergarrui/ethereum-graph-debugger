import React from 'react';

import classnames from 'classnames/bind';

import styles from './Form.scss';

const cx = classnames.bind(styles);

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    }
  }

  handleInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
    });

    this.props.onInputChange(event);
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

    this.props.onInputKeyUp();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onSubmitForm();
  }

  render() {

    const { inputTypes, submitButton, buttonValue, row } = this.props;

    const inputsClasses = cx({
      'form__inputs': true,
      'form__inputs--row': !!row
    });

    return (
      <form className={styles['form']} onSubmit={(e) => this.handleSubmit(e)}>
        <div className={inputsClasses}>
          {
            inputTypes.map(item => {
              return (
                <div key={item.name} className={styles['form__inputs__item']}>
                  <input 
                    name={item.name}
                    placeholder={item.placeholder}
                    onChange={(e) => this.handleInputChange(e)}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                    onKeyUp={(e) => this.handleKeyUp(e)}
                  />
                </div>
              )
            })
          }
        </div>
        {
          submitButton &&
          <div className={styles['form__button']}>
            <button type='submit'><span>{buttonValue}</span></button>
          </div>
        }
      </form>
    )
  }
}

export default Form;