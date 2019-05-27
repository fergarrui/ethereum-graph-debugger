import React from 'react';
import classnames from 'classnames/bind';
import { connect } from 'react-redux';

import { getVersionNumber } from '../Store/Actions';

import styles from './Version.scss';

const cx = classnames.bind(styles);

const mapDispatchToProps = dispatch => ({
  getVersionNumber: version => dispatch(getVersionNumber(version))
});

class Version extends React.Component {

  handleSelect(event) {
    this.props.getVersionNumber(event.target.innerText);
    this.props.onVersionItemClick();
  }

  render() {
    const { data } = this.props;

    return (
      <div className={styles['version']}>
        {
          data.map((item, i) => {
              return (
                <div 
                  key={`id--${item.version}`}
                  className={styles['version__item']}
                  onClick={(e) => this.handleSelect(e)}
                  >
                  <span>{item.version}</span>
                </div>
          )})
        }
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Version);