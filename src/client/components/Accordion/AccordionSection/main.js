import React from 'react';

import classnames from 'classnames/bind';

import styles from '../../../styles/Accordion/AccordionSection.scss';

const cx = classnames.bind(styles);

class AccordionSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    }
  }

  handleClick() {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }))
  }

  render() {

    const { expanded } = this.state;
    const { title, content, children } = this.props;

    const titleClasses = cx({
      'accordion-section__title': true,
      'accordion-section__title--expanded': !!expanded,
    });
  
    const contentClasses = cx({
      'accordion-section__content': true,
      'accordion-section__content--expanded': !!expanded,
    })
  
      return (
        <div className={styles['accordion-section']}>
          <div className={titleClasses} onClick={() => this.handleClick()}>
            {title}
          </div>
          <div className={contentClasses}>
            <div className={styles['accordion-section__content__item']}>
              {children}
            </div>
          </div>
        </div>
      );
  }
}

AccordionSection.displayName = 'AccordionSection';

export default AccordionSection;