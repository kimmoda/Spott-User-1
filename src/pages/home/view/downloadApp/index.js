import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
// import { fromJS } from 'immutable'; // TODO: remove after API is implemented
import { colors, mediaQueries, Button, UpperCaseSubtitle, SectionTitle, Title, ScalableContainer, pinkButtonStyle } from '../../../_common/buildingBlocks';
// import { dummySelector } from '../../selectors';
// import { dummy } from '../../actions';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import localized from '../../../_common/localized';

const spottImage = require('./images/spott.jpg');
const deviceImage = require('./images/device.png');

@localized
@Radium
export default class DownloadApp extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired
  }

  static styles = {
    button: {
      marginBottom: '21em',
      position: 'relative',
      [mediaQueries.small]: {
        marginBottom: '28em'
      },
      [mediaQueries.medium]: {
        marginBottom: '16.262em'
      }
    },
    container: {
      backgroundColor: colors.white,
      paddingTop: '6.25em',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      position: 'relative',
      textAlign: 'center',
      [mediaQueries.medium]: {
        textAlign: 'left'
      }
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
      // backgroundImage: 'linear-gradient(to bottom, #000000, rgb(255, 255, 255))',
      pointerEvents: 'none' // Don't capture pointer events. "Click through..."
    },
    title: {
      marginBottom: '0.17em'
    },
    subtitle: {
      opacity: 0.5
    },
    upperCaseSubtitle: {
      marginBottom: '1.635em'
    },
    wrapper: {
      position: 'relative'
    },
    deviceWrapper: {
      position: 'absolute',
      height: 'auto',
      // right: 0,
      width: '50%',
      bottom: 0,
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      [mediaQueries.small]: {
        width: '60%',
        maxWidth: 360
      },
      [mediaQueries.medium]: {
        width: '60%',
        marginLeft: 'inherit',
        marginRight: 'inherit',
        left: 'inherit'
      },
      [mediaQueries.large]: {
        width: '40%',
        maxWidth: 600
      }
    },
    device: {
      display: 'block',
      width: '100%'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { t } = this.props;
    return (
      <ScalableContainer style={{ ...styles.container, backgroundImage: `url("${spottImage}")` }}>
        <div style={styles.overlay}></div>
        <div style={styles.phone}></div>
        <div style={styles.deviceWrapper}>
          <img src={deviceImage} style={styles.device} />
        </div>
        <div style={styles.wrapper}>
          <Title style={styles.title}>{t('home.downloadApp.title')}</Title>
          <SectionTitle style={styles.subtitle}>{t('home.downloadApp.subtitle')}</SectionTitle>
          <UpperCaseSubtitle style={styles.upperCaseSubtitle}>{t('home.downloadApp.availability')}</UpperCaseSubtitle>
          <Button style={{ ...pinkButtonStyle, ...styles.button }}>{t('home.downloadApp.downloadButton')}</Button>
        </div>
      </ScalableContainer>
    );
  }

}
