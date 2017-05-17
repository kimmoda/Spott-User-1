/* eslint-disable react/no-set-state */
/* eslint-disable react/jsx-indent-props */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactModal from 'react-modal';
import { Link } from 'react-router';
import { push as routerPush } from 'react-router-redux';
import localized from '../../../_common/localized';
import { IconHeart, IconForward, IconClose } from '../icons';
import CardMarkers from '../cardMarkers';
import Topics from '../topics';
import Sidebars from '../sidebars';
import Users from '../users';
import ImageLoader from '../imageLoader';
import Tiles from '../tiles';
import * as actions from '../../actions';
import { spottDetailsSelector } from '../../selectors';
import Cards from '../cards/index';

const styles = require('./index.scss');

@localized
@connect(spottDetailsSelector, (dispatch) => ({
  clearSidebarProducts: bindActionCreators(actions.clearSidebarProducts, dispatch),
  loadSidebarProduct: bindActionCreators(actions.loadSidebarProduct, dispatch),
  loadSpottDetails: bindActionCreators(actions.loadSpottDetails, dispatch),
  removeSpottLover: bindActionCreators(actions.removeSpottLover, dispatch),
  routerPush: bindActionCreators(routerPush, dispatch),
  setSpottLover: bindActionCreators(actions.setSpottLover, dispatch)
}))
@CSSModules(styles, { allowMultiple: true })
export default class CardModal extends Component {
  static propTypes = {
    clearSidebarProducts: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    currentUserId: PropTypes.string,
    loadSidebarProduct: PropTypes.func.isRequired,
    loadSpottDetails: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      state: PropTypes.shape({
        modal: PropTypes.bool,
        imageThumb: PropTypes.object,
        returnTo: PropTypes.string,
        sidebarMarker: PropTypes.any
      })
    }).isRequired,
    params: PropTypes.shape({
      spottId: PropTypes.string.isRequired,
      spottTitle: PropTypes.string.isRequired
    }).isRequired,
    removeSpottLover: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired,
    setSpottLover: PropTypes.func.isRequired,
    sidebarProducts: PropTypes.any.isRequired,
    spott: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onCloseHandler = ::this.onCloseHandler;
    this.onProductClick = ::this.onProductClick;
    this.onSidebarClose = ::this.onSidebarClose;
    this.onWrapperClick = ::this.onWrapperClick;
    this.handleResize = ::this.handleResize;
    this.tileOffsetWidth = parseInt(styles.cssTileOffsetWidth, 10);
    this.state = {
      width: 280
    };
  }

  componentWillMount () {
    this.props.loadSpottDetails({ uuid: this.props.params.spottId });
    if (this.props.location.state && this.props.location.state.sidebarMarker) {
      this.props.loadSidebarProduct({ uuid: this.props.location.state.sidebarMarker.getIn([ 'product', 'uuid' ]), relevance: this.props.location.state.sidebarMarker.get('relevance') });
    }
  }

  componentDidMount () {
    this._originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', this.handleResize);
    this.getWidth();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.spottId && nextProps.params.spottId && this.props.params.spottId !== nextProps.params.spottId) {
      this.props.loadSpottDetails({ uuid: nextProps.params.spottId });
      if (nextProps.location.state && nextProps.location.state.sidebarMarker) {
        this.props.loadSidebarProduct({ uuid: nextProps.location.state.sidebarMarker.getIn([ 'product', 'uuid' ]), relevance: nextProps.location.state.sidebarMarker.get('relevance') });
      }
      this.getWidth();
    }
  }

  componentWillUnmount () {
    document.body.style.overflow = this._originalOverflow;
  }

  handleResize () {
    this.getWidth();
  }

  getWidth () {
    if (this.imageContainer) {
      this.setState({ width: this.imageContainer.clientWidth });
    }
  }

  onCloseHandler () {
    if (this.props.sidebarProducts.get('data').size) {
      this.props.clearSidebarProducts();
    } else if (this.props.onClose) {
      this.props.onClose();
    } else {
      this.props.routerPush((this.props.location.state && this.props.location.state.returnTo) || `/${this.props.currentLocale}/`);
    }
  }

  onProductClick (marker) {
    this.props.loadSidebarProduct({ uuid: marker.getIn([ 'product', 'uuid' ]), relevance: marker.get('relevance') });
  }

  onSidebarClose () {
    this.props.clearSidebarProducts();
  }

  onWrapperClick (e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose();
  }

  onLoveClick (spottId, loved) {
    if (this.props.currentUserId) {
      if (loved) {
        this.props.removeSpottLover({ uuid: spottId });
      } else {
        this.props.setSpottLover({ uuid: spottId });
      }
    } else {
      this.props.routerPush({ pathname: `/${this.props.currentLocale}/login`, state: { modal: true, returnTo: ((this.props.location && this.props.location.pathname) || '/') } });
    }
  }

  render () {
    const { spott, sidebarProducts, currentLocale, location } = this.props;
    const imageThumb = this.props.location.state && this.props.location.state.imageThumb ? this.props.location.state.imageThumb : null;
    const { width } = this.state;
    console.log(spott.get('image'));
    return (
      <ReactModal
        className={styles['modal-content']}
        isOpen
        overlayClassName={styles['modal-overlay']}
        onRequestClose={this.onCloseHandler}>

        <div className={sidebarProducts.get('data').size ? styles['main-sidebar-active'] : styles['main-sidebar-inactive']}
             styleName='main'>
          <div styleName='modal-close-layer' onClick={this.onCloseHandler}/>
          <div className={sidebarProducts.get('data').size ? styles['main-sidebar-wrapper-active'] : styles['main-sidebar-wrapper-inactive']}
               styleName='main-sidebar-wrapper'>
            <div styleName='modal-close-layer' onClick={this.onCloseHandler}/>
            <div styleName='card'>
              <div styleName='modal-close' onClick={this.onCloseHandler}>
                <i><IconClose/></i>
              </div>
              <div ref={(ref) => { this.imageContainer = ref; }} styleName='image'>
                {spott.get('image') && <ImageLoader imgOriginal={spott.get('image')} imgThumb={imageThumb ? imageThumb : spott.get('image')} width={width} widthThumb={80}/>}
                {spott.get('productMarkers') && <CardMarkers markers={spott.get('productMarkers')} onMarkerClick={this.onProductClick}/>}
                {spott.get('personMarkers') &&
                  <div styleName='persons'>
                    {spott.get('personMarkers').map((person) =>
                      <Link
                        key={`person_marker_${person.get('uuid')}`}
                        style={{ backgroundImage: `url(${person.getIn([ 'character', 'avatar', 'url' ])}?width=32&height=32)` }}
                        styleName='person'
                        title={person.getIn([ 'character', 'name' ])}
                        to={`/${currentLocale}/topic/CHARACTER%7C${person.getIn([ 'character', 'uuid' ])}`}/>
                    )}
                  </div>}
              </div>
              <div styleName='products'>
                {spott.get('productMarkers') && <Tiles tileOffsetWidth={this.tileOffsetWidth} tilesCount={spott.get('productMarkers').size}>
                  {spott.get('productMarkers').map((item, index) =>
                    <div
                      className={item.get('relevance') === 'EXACT' ? styles['product-exact'] : styles['product-medium']}
                      key={`product_${index}`}
                      style={{ backgroundImage: `url('${item.getIn([ 'product', 'image', 'url' ])}?width=80&height=80')` }}
                      styleName='product'
                      onClick={this.onProductClick.bind(this, item)}/>
                  )}
                </Tiles>}
              </div>
              <div styleName='content'>
                <h3 styleName='title'>{spott.get('title')}</h3>
                <div styleName='description'>
                  {spott.get('comment')}
                </div>
                <div styleName='topic-links'>
                  {spott.get('topics') && spott.get('topics').map((topic, index) =>
                    <Link key={`m_topic_${index}_${topic.get('uuid')}`} styleName='topic-link' to={`/${currentLocale}/topic/${topic.get('uuid')}`}>{topic.get('text')}</Link>
                  )}
                </div>
              </div>
              <div styleName='footer'>
                <div className={spott.get('loved') && styles['likes-liked']} styleName='likes' onClick={this.onLoveClick.bind(this, spott.get('uuid'), spott.get('loved'))}>
                  <i><IconHeart/></i>
                  <span>{spott.get('loverCount')}</span>
                </div>
                <div styleName='users'>
                  {spott.getIn([ 'lovers', 'data' ]) && <Users items={spott.getIn([ 'lovers', 'data' ])} large maxNum={16}/>}
                </div>
                <Link styleName='moar' to='#'>
                  <i><IconForward/></i>
                </Link>
              </div>
            </div>
            {Boolean(spott.getIn([ 'relatedTopics', 'data' ]) && spott.getIn([ 'relatedTopics', 'data' ]).size) &&
              <div styleName='topics responsive-container'>
                <div styleName='topics-content'>
                  <div styleName='topics-title'>Related Topics</div>
                  <Topics items={spott.get('relatedTopics')}/>
                </div>
              </div>}
            {Boolean(spott.getIn([ 'similar', 'data' ]) && spott.getIn([ 'similar', 'data' ]).size) &&
              <div styleName='spotts responsive-container'>
                <div styleName='spotts-title'>Similar Spotts</div>
                <div styleName='spotts-list'>
                  <Cards location={location} spotts={spott.get('similar')}/>
                </div>
              </div>}
          </div>
        </div>
        <Sidebars location={location} onSidebarClose={this.onSidebarClose}/>
      </ReactModal>
    );
  }
}
