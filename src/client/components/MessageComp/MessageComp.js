import React from 'react';
import { connect } from 'react-redux';

import { hideErrorMessage } from '../Store/Actions.js';

import Icon from '../Icon/Icon';

import styles from './MessageComp.scss';

const mapDispatchToProps = dispatch => {
  return {
    errorMessageOff: () => dispatch(hideErrorMessage()),
  }
}

class ConnectedMessageComp extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyUp);
  }

  UNSAFE_componentWillMount() {
    document.removeEventListener('keydown', this.handleKeyUp);
  }

  handleKeyUp(event) {
    if(event.keyCode !== 27) {
      return;
    }
    this.props.errorMessageOff();
  }

  render() {
    const { message, errorMessageOff } = this.props;

    return (
      <div className={styles['message-comp']}>
        <div className={styles['message-comp__main']}>
          <div className={styles['message-comp__main__text']}>
            <h1>{message}</h1>
          </div>
          <div className={styles['message-comp__main__button']}>
          {
            message === 'Loading...' 
            ?  <Icon iconName='Spinner' />
            :  <div className={styles['message-comp__main__button__item']}>
                  <button onClick={errorMessageOff}><span>Close</span></button>
                  <span className={styles['escape']}>{`/ ESC`}</span>
              </div>
          }
          </div>
        </div>
      </div>
    )  
  }
}

const MessageComp = connect(null, mapDispatchToProps)(ConnectedMessageComp);

MessageComp.displayName = 'MessageComp';

export default MessageComp;