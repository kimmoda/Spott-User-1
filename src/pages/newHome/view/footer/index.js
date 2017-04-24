/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import localized from '../../../_common/localized';

const styles = require('./index.scss');

const spottGrayLogo = require('./spottGray.svg');

@localized
@CSSModules(styles, { allowMultiple: true })
export default class Footer extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { currentLocale, t } = this.props;

    return (
      <footer styleName='footer'>
        <div styleName='footer-wrapper'>
          <div styleName='footer-left'>
            <Link styleName='logo' to={`/${currentLocale}`}>
              <img alt={t('_common.header.home')} src={spottGrayLogo}/>
            </Link>
            <div styleName='footer-dsc'>
              Spott allows you to find products<br/>
              in the things you watch.
            </div>
          </div>
          <nav styleName='footer-navs'>
            <div styleName='footer-nav'>
              <Link styleName='footer-nav-link' to='#'>About</Link>
              <Link styleName='footer-nav-link' to='#'>Help</Link>
              <Link styleName='footer-nav-link' to='#'>Contact</Link>
            </div>
            <div styleName='footer-nav'>
              <Link styleName='footer-nav-link' to='#'>Terms</Link>
              <Link styleName='footer-nav-link' to='#'>Privacy</Link>
              <Link styleName='footer-nav-link' to='#'>Business</Link>
            </div>
          </nav>
          <div styleName='footer-follow'>
            Follow us on social media
          </div>
          <div styleName='footer-copyright'>
            © Spott 2017<br/>
            Appiness, Hertshage 10, 9300 Aalst, Belgium
          </div>
        </div>
      </footer>
    );
  }
}