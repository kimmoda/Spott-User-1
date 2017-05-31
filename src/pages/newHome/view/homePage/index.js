/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Masonry from 'react-masonry-component';
import VisibilitySensor from 'react-visibility-sensor';
import localized from '../../../_common/localized';
import Topics from '../topics';
import Card from '../card';
import * as actions from '../../actions';
import { newHomeSelector } from '../../selectors';
import { FETCHING, LOADED } from '../../../../data/statusTypes';

const styles = require('./index.scss');

@localized
@connect(newHomeSelector, (dispatch) => ({
  loadSpottsList: bindActionCreators(actions.loadSpottsListWrapper, dispatch),
  loadTrendingTopics: bindActionCreators(actions.loadTrendingTopics, dispatch)
}))
@CSSModules(styles, { allowMultiple: true })
export default class NewHome extends Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    feedSpotts: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.string,
    loadSpottsList: PropTypes.func.isRequired,
    loadTrendingTopics: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    spotts: PropTypes.any.isRequired,
    spottsPromoted: PropTypes.any.isRequired,
    spottsSubscribed: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired,
    trendingTopics: PropTypes.any.isRequired
  };

  constructor (props) {
    super(props);
    this.handleResize = ::this.handleResize;
    this.loadData = ::this.loadData;
    this.loadMore = ::this.loadMore;
    this.loadOnScroll = ::this.loadOnScroll;
    this.loadMoreVisibility = ::this.loadMoreVisibility;
    this.handleLoadSpotts = ::this.handleLoadSpotts;
    this.state = {
      width: 280,
      lazyLoadMode: true
    };
  }

  componentDidMount () {
    this.loadData(this.props);
    this.props.loadTrendingTopics();
    window.addEventListener('resize', this.handleResize);
    this.getWidth();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isAuthenticated !== this.props.isAuthenticated) {
      this.loadData(nextProps);
      this.setState({ lazyLoadMode: true });
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  loadData (props) {
    const { spotts, spottsSubscribed, spottsPromoted, isAuthenticated } = props;
    const pages = {
      spottsPage: spotts.get('page', 0),
      spottsSubscribedPage: spottsSubscribed.get('page', 0),
      spottsPromotedPage: spottsPromoted.get('page', 0)
    };
    this.props.loadSpottsList(Boolean(isAuthenticated), pages);
  }

  handleResize () {
    this.getWidth();
  }

  getWidth () {
    if (this.cardsContainer) {
      if (window.outerWidth <= 640 && window.outerWidth > 425) {
        this.setState({ width: (this.cardsContainer.clientWidth - 64) / 2 });
      } else if (window.outerWidth <= 425) {
        this.setState({ width: (this.cardsContainer.clientWidth - 32) / 2 });
      } else {
        this.setState({ width: 280 });
      }
    }
  }

  loadMore () {
    this.handleLoadSpotts();
  }

  loadOnScroll (isVisible) {
    const { spotts: s, spottsSubscribed: ss } = this.props;
    const { lazyLoadMode } = this.state;
    if (isVisible && lazyLoadMode && (ss.get('_status') === LOADED || s.get('_status') === LOADED) && (ss.get('data').size + s.get('data').size < 15)) {
      this.handleLoadSpotts();
    }
    if (ss.get('data').size + s.get('data').size > 15) {
      this.setState({ lazyLoadMode: false });
    }
  }

  handleLoadSpotts () {
    const { spotts: s, spottsSubscribed: ss, spottsPromoted: sp } = this.props;
    const pages = {
      spottsPage: s.get('page', -1) + 1 < s.get('pageCount') ? s.get('page', -1) + 1 : -1,
      spottsSubscribedPage: ss.get('page', -1) + 1 < ss.get('pageCount') ? ss.get('page', -1) + 1 : -1,
      spottsPromotedPage: sp.get('page', -1) + 1 < sp.get('pageCount') ? sp.get('page', -1) + 1 : -1
    };
    this.props.loadSpottsList(Boolean(this.props.isAuthenticated), pages);
  }

  loadMoreVisibility () {
    const { spotts: s, spottsSubscribed: ss } = this.props;
    const { lazyLoadMode } = this.state;
    if (lazyLoadMode) {
      return false;
    }
    if (s.get('data').size && s.get('_status') !== FETCHING && s.get('page') + 1 < s.get('pageCount')) {
      return true;
    }
    if (ss.get('data').size && ss.get('_status') !== FETCHING && ss.get('page') + 1 < ss.get('pageCount')) {
      return true;
    }
    return false;
  }

  render () {
    const { trendingTopics, location, feedSpotts, t } = this.props;
    const { width, lazyLoadMode } = this.state;
    return (
      <section styleName='wrapper'>
        <div styleName='topics responsive-container'>
          <div styleName='topics-content'>
            <div styleName='topics-title'>{t('topic.trendingTopics')}</div>
            <Topics items={trendingTopics} />
          </div>
        </div>
        <div styleName='cards responsive-container'>
          <div ref={(ref) => { this.cardsContainer = ref; }} styleName='cards-wrapper'>
            <Masonry disableImagesLoaded options={{ transitionDuration: 100, isFitWidth: true, horizontalOrder: true }}>
              {feedSpotts.map((item, index) =>
                <div key={`home_card_${index}_${item.get('uuid')}`} styleName='card-selector'>
                  <Card item={item} key={`home_card_${index}_${item.get('uuid')}`} location={location} spottId={item.get('uuid')} width={width}/>
                </div>
              )}
            </Masonry>
          </div>
        </div>
        <VisibilitySensor active={lazyLoadMode} delayedCall intervalDelay={1000} onChange={this.loadOnScroll}/>
        {this.loadMoreVisibility() && <div styleName='load-more responsive-element' onClick={this.loadMore}>{t('common.loadMore')}</div>}
      </section>
    );
  }
}
