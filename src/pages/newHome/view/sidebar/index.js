/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import localized from '../../../_common/localized';
import { IconForward, IconStar, IconClose } from '../icons';
import Users from '../users/index';

const styles = require('./index.scss');

@localized
@CSSModules(styles, { allowMultiple: true })
export default class Sidebar extends Component {
  static propTypes = {
    product: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    onProductClick: PropTypes.func.isRequired
  };

  render () {
    const { product, onBackClick, onProductClick } = this.props;

    return (
      <div styleName='sidebar'>
        <div styleName='sidebar-header'>
          <div styleName='sidebar-title'>{product}</div>
          <div styleName='sidebar-close' onClick={onBackClick.bind(this, product)}>
            <i><IconClose/></i>
          </div>
        </div>
        <div styleName='sidebar-image'>
          <img src='https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/c61222a6-70d2-4d64-b81f-f5e30a9cab19?height=424&width=424'/>
        </div>
        <div styleName='sidebar-photos'>
          {new Array(7).fill(1).map((item, index) =>
            <div key={`sidebar_photo_${index}`} style={{ backgroundImage: `url(http://lorempixel.com/80/80/abstract/${index})` }} styleName='sidebar-photo'/>
          )}
        </div>
        <div styleName='sidebar-panel'>
          <Link styleName='sidebar-brand' to='#'>Tom Ford</Link>
          <div styleName='sidebar-title2'>{product}— Blue</div>
          <div styleName='sidebar-cost'>$5,180</div>
          <div styleName='sidebar-options'>
            <select styleName='sidebar-select'>
              <option value='0'>58R</option>
              <option value='0'>62R</option>
            </select>
            <select styleName='sidebar-select'>
              <option value='0'>Blue</option>
              <option value='0'>Black</option>
            </select>
            <div styleName='sidebar-add'>Add to Basket</div>
          </div>
        </div>
        <div styleName='sidebar-footer'>
          <Link styleName='sidebar-stars' to='#'>
            <i><IconStar/></i>
            <span>28</span>
          </Link>
          <div styleName='sidebar-users'>
            <Users large />
          </div>
          <Link styleName='sidebar-moar' to='#'>
            <i><IconForward/></i>
          </Link>
        </div>
        <div styleName='sidebar-panel'>
          <div styleName='sidebar-panel-title'>Description</div>
          <div styleName='sidebar-description'>
            An exceptional example of Tom Ford tailoring,<br/>
            this three-piece suit offers distinguished elegance.
          </div>
        </div>
        <div styleName='sidebar-panel'>
          <div styleName='sidebar-panel-title'>Also seen in</div>
          <div styleName='sidebar-seens'>
            {new Array(7).fill(1).map((item, index) =>
              <div
                key={`seen_${index}`}
                style={{ backgroundImage: `url(http://lorempixel.com/80/80/abstract/${index})` }}
                styleName='sidebar-seen'
                onClick={onProductClick.bind(this, `Seen ${index}`)}/>
            )}
          </div>
        </div>
        <div styleName='sidebar-panel'>
          <div styleName='sidebar-panel-title'>Similar Items</div>
          <div styleName='sidebar-similars'>
            {new Array(7).fill(1).map((item, index) =>
              <div
                key={`product_${index}`}
                style={{ backgroundImage: `url(http://lorempixel.com/80/80/abstract/${index})` }}
                styleName='sidebar-similar'
                onClick={onProductClick.bind(this, `Product ${index}`)}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}
