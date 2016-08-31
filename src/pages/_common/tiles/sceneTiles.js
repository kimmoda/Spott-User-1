import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { fontWeights, makeTextStyle, mediaQueries, RadiumLink } from '../../_common/buildingBlocks';
import ImmutablePropTypes from 'react-immutable-proptypes';
import BaseTile from './_baseTile';
import Marker from './_marker';
import localized from '../localized';
import hoverable from '../hoverable';
import makeTiles from './_makeTiles';
import { fetchScene } from '../../../data/actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(undefined, (dispatch) => ({
  fetchScene: bindActionCreators(fetchScene, dispatch)
}))
@localized
@hoverable
@Radium
export class SceneTile extends Component {

  static propTypes = {
    fetchScene: PropTypes.func,
    hovered: PropTypes.bool.isRequired,
    item: ImmutablePropTypes.mapContains({
      id: PropTypes.string.isRequired,
      image: ImmutablePropTypes.mapContains({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
      /* TODO: add ;)
      seriesLogo: PropTypes.string,
      season: PropTypes.number.isRequired,
      episode: PropTypes.number.isRequired,
      faces: ImmutablePropTypes.listOf(
        ImmutablePropTypes.mapContains({
          id: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired
        })
      ),
      products: ImmutablePropTypes.listOf(
        ImmutablePropTypes.mapContains({
          id: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired
        })
      ),
      markers: ImmutablePropTypes.listOf(
        ImmutablePropTypes.mapContains({
          id: PropTypes.string.isRequired,
          relativeLeft: PropTypes.number.isRequired,
          relativeTop: PropTypes.number.isRequired
        })
      )
      */
    }).isRequired,
    // The location to return to if the popup closes.
    location: PropTypes.object,
    showDetails: PropTypes.bool,
    style: PropTypes.object,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.renderDetails = ::this.renderDetails;
    this.onHoverChange = ::this.onHoverChange;
  }

  onHoverChange (hovered) {
    if (this.props.showDetails && hovered && this.props.item.get('_summary')) {
      // Fetch all scene data, including appearances
      this.props.fetchScene({ sceneId: this.props.item.get('id') });
    }
  }

  static styles = {
    wrapper: {
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'none'
      },
      ':active': {
        textDecoration: 'none'
      },
      ':visited': {
        textDecoration: 'none'
      }
    },
    container: {
      position: 'relative',
      paddingTop: '56%',
      height: 0,
      width: '100%'
    },
    layer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
      pointerEvents: 'none' // Don't capture pointer events. "Click through..."
    },
    details: {
      base: {
        opacity: 0,
        transition: 'opacity 0.5s ease-in'
      },
      hovered: {
        transition: 'opacity 0.5s ease-out',
        opacity: 1
      }
    },
    image: {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      borderRadius: '0.25em',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    markers: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    },
    /* TODO: replaced by text for now
    seriesLogo: {
      position: 'absolute',
      maxWidth: '5.1875em',
      maxHeight: '2em',
      filter: 'brightness(0) invert(1)',
      top: '1.125em',
      left: '1.25em'
    }, */
    seriesText: {
      position: 'absolute',
      right: '1.818em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...makeTextStyle(fontWeights.regular, '0.6875em', '0.318em'),
      color: '#ffffff',
      textTransform: 'uppercase',
      top: '1.125em',
      left: '1.818em'
    },
    text: {
      position: 'absolute',
      bottom: '6.8em',
      left: '1.818em',
      right: '1.818em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...makeTextStyle(fontWeights.regular, '0.6875em', '0.318em'),
      color: '#ffffff',
      textTransform: 'uppercase',
      [mediaQueries.large]: {
        bottom: '7.6em'
      }
    },
    textHighlight: {
      ...makeTextStyle(fontWeights.bold, '1em', '0.318em')
    },
    line: {
      position: 'absolute',
      left: '1.25em',
      right: '1.25em',
      bottom: '4.125em',
      opacity: 0.3,
      backgroundColor: '#ffffff',
      height: '1px',
      [mediaQueries.large]: {
        bottom: '4.625em'
      }
    },
    faces: {
      position: 'absolute',
      left: '1.25em',
      right: '1.25em',
      textAlign: 'right',
      top: '1.125em'
    },
    products: {
      position: 'absolute',
      left: '1.25em',
      right: '1.25em',
      bottom: '1.125em',
      height: '2em',
      overflow: 'hidden'
    },
    subtile: {
      base: {
        backgroundColor: 'white',
        height: '2em',
        float: 'left',
        position: 'relative',
        opacity: 0.98,
        width: '2em',
        marginBottom: '3em',
        [mediaQueries.large]: {
          width: '2.5em',
          height: '2.5em'
        }
      },
      face: {
        marginLeft: '0.4em'
      },
      product: {
        marginRight: '0.4em'
      }
    },
    subtileImage: {
      bottom: 0,
      height: 'auto',
      left: 0,
      margin: 'auto',
      maxHeight: '100%',
      maxWidth: '100%',
      position: 'absolute',
      right: 0,
      top: 0,
      width: 'auto',
      transition: 'filter 0.25s ease-in-out',
      ':hover': {
        filter: 'opacity(70%)'
      }
    }
  };

  renderDetails () {
    const { styles } = this.constructor;
    const { hovered, item, t } = this.props;

    return (
      <div key='details' style={[ styles.details.base, hovered && styles.details.hovered ]}>
        <div>{item.get('products').map((product) =>
          <Marker key={product.get('id')} relativeLeft={product.getIn([ 'position', 'x' ])} relativeTop={product.getIn([ 'position', 'y' ])} />)}
        </div>
        {/* <div style={styles.faces}>{item.get('faces').take(4).map((face) =>
          <div key={face.get('id')} style={[ styles.subtile.base, styles.subtile.face ]}>
            <img alt={face.get('name')} key={face.get('id')} src={face.get('image')} style={styles.subtileImage} title={face.get('name')}/>
          </div>)}
        </div>*/}
        <div style={styles.line} />
        <div style={styles.products}>{item.get('products').take(8).filter((p) => p.get('image')).map((product) =>
          <div key={product.get('id')} style={[ styles.subtile.base, styles.subtile.product ]}>
            <img alt={product.get('shortName')} key={product.get('id')} src={product.getIn([ 'image', 'url' ])} style={styles.subtileImage} title={product.get('shortName')}/>
          </div>)}
        </div>
        {(() => {
          if (item.get('episode')) { // Scene from an episode
            return (
              <div>
                <p style={styles.text}>
                  {t('_common.sceneTiles.sceneFromEpisode', { episode: item.getIn([ 'episode', 'number' ]), season: item.getIn([ 'season', 'number' ]) }, (contents, key) => {
                    return <span key={key} style={styles.textHighlight}>{contents}</span>;
                  })}
                </p>
                {<p style={styles.seriesText}>{item.getIn([ 'series', 'title' ])}</p>}
              </div>
            );
          } else if (item.get('movie')) { // Scene from a movie
            return (
              <p style={styles.text}>
                {t('_common.sceneTiles.sceneFromMovie', { movie: item.getIn([ 'movie', 'title' ]) }, (contents, key) => {
                  return <span key={key} style={styles.textHighlight}>{contents}</span>;
                })}
              </p>
            );
          }
        })()}
      </div>
    );
  }

  render () {
    const { styles } = this.constructor;
    const { item, location, style, showDetails } = this.props;

    return (
      <BaseTile style={style}>
        <RadiumLink key={item.get('id')} style={styles.wrapper} to={{
          pathname: item.get('shareUrl'),
          state: { modal: true, returnTo: (location && location.pathname) || '/' }
        }}>
          <div style={styles.container}>
            <div style={[ styles.image, item.get('image') && { backgroundImage: `url("${item.getIn([ 'image', 'url' ])}?width=750&height=422")` } ]} />
            <div style={styles.layer} />
            {showDetails && this.renderDetails()}
          </div>
        </RadiumLink>
      </BaseTile>
    );
  }
}

export default makeTiles(
  0.938,
  { extraSmall: 1, small: 1, medium: 2, large: 2, extraLarge: 2 },
  (instanceProps) => <SceneTile {...instanceProps} />
);
