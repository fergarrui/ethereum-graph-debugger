import React from 'react';

import styles from '../../styles/Input.scss';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });

    this.props.onChange(event);
  }

  handleKeyUp(event) {
    if(event.keyCode !== 13) {
      return;
    }

    const { value } = event.target;

    this.setState({
      value,
    });

    this.handleClick(value);
  }

  handleClick(e) {

    this.setState({
      value: event.target.value,
      parameter: this.state.value,
    });

    this.props.onSubmit();
  }


  render() {

    const { placeholder, value } = this.props;

    return (
      <div className={styles['input']}>
        <div className={styles['input__item']}>
          <input 
            type='text' 
            placeholder={placeholder}
            onChange={(e) => this.handleChange(e)} 
            onKeyUp={(e) => this.handleKeyUp(e)}
            autoFocus
          />
        </div>
        <div className={styles['input__item']}>
          <input 
            type='submit' 
            buttonValue={value}
            onClick={(e) => this.handleClick(e)}
          />
        </div>
      </div>
    )
  }
}

Input.displayName= 'Input';

export default Input;
