import React from 'react';

import classnames from 'classnames/bind';

import styles from './SettingsBar.scss';

const cx = classnames.bind(styles);


class SettingsBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configCleared: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
      configCleared: false,
    });

    localStorage.setItem(name, value);
  }

  handleKeyUp(event) {    
    const { onSaveButtonClick } = this.props;


    if(event.keyCode !== 13) {
      return;
    }

    onSaveButtonClick();
  }

  handleClick() {
    localStorage.clear();

    this.setState({
      configCleared: true,
    });
  }

  handleSaveClick() {
    const { onSaveButtonClick } = this.props;

    onSaveButtonClick();
  }

  render() {
    const { active } = this.props;
    const { configCleared } = this.state;

    const settingsBarClasses = cx({
      'settings-bar': true,
      'settings-bar--active': !!active
    });
  
      return (
        <div className={settingsBarClasses}>
          <div className={styles['settings-bar__item']}>
            <input
              name='host' 
              placeholder={localStorage.getItem('host') || 'Blockchain host (default: 127.0.0.1:8545)'}  
              onChange={this.handleInputChange}
              onKeyUp={this.handleKeyUp}
             />
          </div>
          <div className={styles['settings-bar__item']}>
            <input
              name='protocol' 
              placeholder={localStorage.getItem('protocol') || 'Blockchain protocol (default: http)'} 
              onChange={this.handleInputChange}
              onKeyUp={this.handleKeyUp}
             />
          </div>
          <div className={styles['settings-bar__item']}>
            <input
              name='username'
              placeholder={localStorage.getItem('username') || 'Blockchain basic auth username'} 
              onChange={this.handleInputChange}
              onKeyUp={this.handleKeyUp}
             />
          </div>
          <div className={styles['settings-bar__item']}>
            <input
              name='password' 
              placeholder={localStorage.getItem('password') || 'Blockchain basic auth password'} 
              onChange={this.handleInputChange}
              onKeyUp={this.handleKeyUp}
             />
          </div>
          <div className={styles['settings-bar__item']}>
            <button onClick={() => this.handleSaveClick()}><span>Save and Close</span></button>
            <button onClick={() => this.handleClick()}><span>Clear Config</span></button>
          </div>
          <div className={styles['settings-bar__item']}>
            {
              configCleared && <p>Config cleared</p>
            }
          </div>
        </div>
      )
  }
}

SettingsBar.displayName = 'SettingsBar';

export default SettingsBar;