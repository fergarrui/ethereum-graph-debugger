import React from 'react';

import styles from '../../styles/Hamburger.scss';

import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Hamburger = ({ clicked, onIconClick }) => {

    const topLayerClasses = cx({
        'hamburger__top-layer': true,
        'hamburger__top-layer--active': !!clicked,
    });

    const middleLayerClasses = cx({
        'hamburger__middle-layer': true,
        'hamburger__middle-layer--active': !!clicked,
    });

    const bottomLayerClasses = cx({
        'hamburger__bottom-layer': true,
        'hamburger__bottom-layer--active': !!clicked,
    });

    return (
        <div onClick={onIconClick} className={styles['hamburger']}>
            <div className={topLayerClasses}></div>
            <div className={middleLayerClasses}></div>
            <div className={bottomLayerClasses}></div>
        </div>
    )
}

Hamburger.displayName = 'Hamburger';

export default Hamburger;