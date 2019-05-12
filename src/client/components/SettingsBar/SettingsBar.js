import React from 'react';
import classnames from 'classnames/bind';

import Form from '../Form/Form';

import styles from './SettingsBar.scss';

const cx = classnames.bind(styles);


class SettingsBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configCleared: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {    
    const { name, value } = event.target; 

    this.setState({
      [name]: value,
      configCleared: false,
    });

    localStorage.setItem(name, value);
  }

  handlClearClick() {
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

    const inputTypes = [
      {
        name:'host', 
        placeholder: localStorage.getItem('host') || 'Blockchain host (default: 127.0.0.1:8545)'
      },
      {
        name:'protocol', 
        placeholder: localStorage.getItem('protocol') || 'Blockchain protocol (default: http)'
      },
      {
        name:'username',
        placeholder: localStorage.getItem('username') || 'Blockchain basic auth username'
      },
      {
        name:'password', 
        placeholder: localStorage.getItem('password') || 'Blockchain basic auth password' 
      }
    ]
  
      return (
        <div className={settingsBarClasses}>
          <Form 
            inputTypes={inputTypes}
            onInputChange={(e) => this.handleInputChange(e)}
            onInputKeyUp={() => this.handleSaveClick()}
            settingsBarForm={true}
          />
          <div className={styles['settings-bar__buttons']}>
            <button onClick={() => this.handleSaveClick()}><span>Save and Close</span></button>
            <button onClick={() => this.handlClearClick()}><span>Clear Config</span></button>
          </div>
          <div className={styles['settings-bar__message']}>
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