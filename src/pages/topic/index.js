import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import localized from '../_common/localized';
import { slugify, getDetailsDcFromLinks, backgroundImageStyle } from '../../utils';
import { IconCheckmark } from '../icons';

const styles = require('./index.scss');

@localized
@CSSModules(styles, { allowMultiple: true })
export default class Topics extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { currentLocale, item } = this.props;
    return (
      <Link styleName='topic' to={{
        pathname: `/${currentLocale}/topic/${slugify(item.get('text', ''))}/${item.get('uuid')}`,
        state: { dc: getDetailsDcFromLinks(item.get('links').toJS()) }
      }}>
        <div
          style={backgroundImageStyle(item.getIn([ 'profileImage', 'url' ]), 160, 90)}
          styleName='topic-image'
          title={item.get('text')}/>
        <div styleName='topic-overlay'/>
        <div styleName='topic-title'>
          {item.get('subscribed') && <i><IconCheckmark/></i>}
          <span>{item.get('text')}</span>
        </div>
      </Link>
    );
  }
}
