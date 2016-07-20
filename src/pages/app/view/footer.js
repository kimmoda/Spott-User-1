import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { /* Button, */ colors, Container, fontWeights, makeTextStyle, mediaQueries } from '../../_common/buildingBlocks';
// import Dropdown from '../../_common/dropdown';
import localized from '../../_common/localized';
import Radium from 'radium';
import * as actions from '../actions';

const RadiumLink = Radium(Link);

const localesHash = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands'
};
// const locales = [ 'en' ];

const styles = {
  wrapper: {
    backgroundColor: colors.dark,
    paddingTop: '0.9375em',
    paddingBottom: '0.9375em'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  languageSelection: {
    ...makeTextStyle(fontWeights.regular, '0.813em', '0.031em'),
    color: colors.coolGray,
    flex: '1 1 100%',
    width: '100%',
    textAlign: 'center',
    [mediaQueries.medium]: {
      width: 'auto',
      flex: '0 0 auto',
      textAlign: 'left'
    }
  },
  languageSelectionCurrent: {
    ...makeTextStyle(fontWeights.regular),
    color: colors.white,
    display: 'inline-block'
  },
  language: {
    menu: {
      borderRadius: '0.25em',
      border: `1px solid ${colors.charcoalGray}`,
      backgroundColor: colors.dark,
      bottom: '100%',
      flex: '1 1 100%',
      left: 0,
      lineHeight: '1em',
      right: 'initial',
      textAlign: 'center',
      width: 'auto'
    },
    menuItem: {
      base: {
        ...makeTextStyle(fontWeights.regular, '0.813em', '0.031em'),
        color: colors.white,
        borderColor: colors.dark,
        borderRadius: '0.25em',
        width: '100%',
        display: 'inline-block',
        textTransform: 'none'
      },
      selected: {
        backgroundColor: colors.charcoalGray
      }
    },
    trigger: {
      lineHeight: '2.125em',
      verticalAlign: 'middle'
    },
    triggerArrow: {
      display: 'inline-block',
      float: 'right',
      textDecoration: 'none',
      color: colors.white
    }
  },
  menu: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '1 1 100%',
    width: '100%',
    margin: '0 auto',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    [mediaQueries.medium]: {
      width: 'auto',
      flex: '1',
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  menuSeparator: {
    ...makeTextStyle(fontWeights.regular, '0.813em', '0.031em'),
    color: colors.coolGray,
    display: 'inline-block',
    [mediaQueries.medium]: {
      display: 'none'
    }
  },
  menuItem: {
    ...makeTextStyle(fontWeights.regular, '0.813em', '0.031em'),
    color: colors.coolGray,
    display: 'inline-block',
    paddingLeft: '0.25em',
    paddingRight: '0.25em',
    textDecoration: 'none',
    [mediaQueries.medium]: {
      paddingLeft: '1.385em',
      paddingRight: '1.385em'
    }
  },
  copyright: {
    ...makeTextStyle(fontWeights.regular, '0.813em', '0.031em'),
    color: colors.coolGray,
    display: 'flex',
    flex: '1 1 100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    [mediaQueries.medium]: {
      width: 'auto',
      flex: '0 0 auto',
      textAlign: 'left',
      paddingTop: 0,
      paddingBottom: 0
    }
  }
};
@localized
@connect(null, (dispatch) => ({
  changeLocale: bindActionCreators(actions.changeLocale, dispatch)
}))
@Radium
export default class Footer extends Component {

  static propTypes = {
    changeLocale: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    style: PropTypes.object,
    t: PropTypes.func.isRequired
  };

  changeLocale (locale, e) {
    e.preventDefault();
    this.props.changeLocale(locale);
  }

  render () {
    const { currentLocale, style, t } = this.props;

    return (
      <footer style={[ styles.wrapper, style ]}>
        <Container className='cf' style={styles.container}>
          <div style={styles.languageSelection}>
            {t('_common.footer.language', {}, (_, key) => (
              <span key='en' style={styles.languageSelectionCurrent}>{localesHash[currentLocale]}</span>
              // <Dropdown button={
              //   <div style={styles.language.trigger}>
              //     <span style={styles.languageSelectionCurrent}>{localesHash[currentLocale]}</span>
              //     <span style={styles.language.triggerArrow}>&nbsp;▾</span>
              //   </div>
              // } contentStyle={styles.language.menu} key='languageSelection'>
              //   {locales.map((locale) => (<Button key={locale} style={[ styles.language.menuItem.base, currentLocale === locale && styles.language.menuItem.selected ]} onClick={this.changeLocale.bind(this, locale)}>{localesHash[locale]}</Button>))}
              // </Dropdown>
            ))}
          </div>
          <div style={styles.menu}>
            <RadiumLink style={styles.menuItem} to={`/${currentLocale}/terms`}>{t('_common.footer.terms')}</RadiumLink>
            <span style={styles.menuSeparator}>/</span>
            <RadiumLink style={styles.menuItem} to={`/${currentLocale}/privacy`}>{t('_common.footer.privacy')}</RadiumLink>
          </div>
          <div style={styles.copyright}>
            {t('_common.footer.copyright')}
          </div>
        </Container>
      </footer>
    );
  }
}