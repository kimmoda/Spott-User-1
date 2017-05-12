/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Masonry from 'react-masonry-component';
import localized from '../../../_common/localized';
import Topics from '../topics';
import Card from '../card';
import * as actions from '../../actions';
import { newHomeSelector } from '../../selectors';
import { FETCHING } from '../../../../data/statusTypes';

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
    isAuthenticated: PropTypes.string,
    loadSpottsList: PropTypes.func.isRequired,
    loadTrendingTopics: PropTypes.func.isRequired,
    spotts: PropTypes.any.isRequired,
    spottsPromoted: PropTypes.any.isRequired,
    spottsSubscribed: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired,
    trendingTopics: PropTypes.any.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.loadSpottsList(Boolean(this.props.isAuthenticated), this.props.spotts.get('page') ? this.props.spotts.get('page') : 0);
    this.props.loadTrendingTopics();
  }

  loadMore (page) {
    this.props.loadSpottsList(Boolean(this.props.isAuthenticated), page);
  }

  render () {
    const { trendingTopics, spotts, spottsSubscribed, spottsPromoted, isAuthenticated } = this.props;
    let promotedIndex = 0;
    return (
      <section styleName='wrapper'>
        <div styleName='topics responsive-container'>
          <div styleName='topics-content'>
            <div styleName='topics-title'>Trending Topics</div>
            <Topics items={trendingTopics} />
          </div>
        </div>
        <div styleName='cards responsive-container'>
          <Masonry disableImagesLoaded options={{ transitionDuration: 100, isFitWidth: true, gutter: 16}}>
            {isAuthenticated && spottsSubscribed.get('data') && spottsSubscribed.get('data').map((item, index) => {
              if ((index + 1) % 2 === 0 && spottsPromoted.getIn([ 'data', promotedIndex ])) {
                promotedIndex++;
                return [
                  <Card item={item} key={`home_card_${index}_${item.get('uuid')}`} spottId={item.get('uuid')}/>,
                  <Card item={spottsPromoted.getIn([ 'data', promotedIndex - 1 ])} key={`home_card_${index}`} spottId={spottsPromoted.getIn([ 'data', promotedIndex - 1, 'uuid' ])}/>
                ];
              }
              return (<Card item={item} key={`home_card_${index}_${item.get('uuid')}`} spottId={item.get('uuid')}/>);
            })}
            {(!isAuthenticated || (!spottsSubscribed.get('data') || spottsSubscribed.get('data').size <= 5)) && spotts.get('data') && spotts.get('data').valueSeq().map((item, index) => {
              if ((index + 1) % 2 === 0 && spottsPromoted.getIn([ 'data', promotedIndex ])) {
                promotedIndex++;
                return [
                  <Card item={item} key={`home_card_${index}_${item.get('uuid')}`} spottId={item.get('uuid')}/>,
                  <Card item={spottsPromoted.getIn([ 'data', promotedIndex - 1 ])} key={`home_card_${index}`} spottId={spottsPromoted.getIn([ 'data', promotedIndex - 1, 'uuid' ])}/>
                ];
              }
              return (<Card item={item} key={`home_card_${index}_${item.get('uuid')}`} spottId={item.get('uuid')}/>);
            })}
          </Masonry>
        </div>
        {Boolean(spotts.get('_status') !== FETCHING && spotts.get('totalResultCount') && spotts.get('totalResultCount') > spotts.get('pageSize') && spotts.get('page') + 1 !== spotts.get('pageCount')) &&
          <div styleName='load-more' onClick={this.loadMore.bind(this, spotts.get('page') + 1)}>Load more...</div>}
      </section>
    );
  }
}
