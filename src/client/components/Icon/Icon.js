import React from 'react';

import SVGInline from 'react-svg-inline';

import CircleLeft from './SVG/circle-left.svg';
import CircleRight from './SVG/circle-right.svg';
import Cross from './SVG/cross.svg';
import Menu from './SVG/menu.svg';
import Spinner from './SVG/spinner.svg';
import Cogs from './SVG/cogs.svg';

import styles from './Icon.scss';

const Icon = ({ iconName }) => {

  const icons = { CircleLeft, CircleRight, Menu, Cross, Spinner, Cogs };

  return (
    <div className={styles['icon']}>
      <SVGInline svg={icons[iconName]} />
    </div>
  );
}

Icon.displayName = 'Icon';

export default Icon;