/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Masonry from 'react-masonry-component';
import localized from '../../../_common/localized';
import Card from '../card';
import { FETCHING } from '../../../../data/statusTypes';

const styles = require('./index.scss');

@localized
@CSSModules(styles, { allowMultiple: true })
export default class Cards extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    loadMore: PropTypes.func,
    location: PropTypes.object.isRequired,
    spotts: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.handleResize = ::this.handleResize;
    this.state = {
      cardWidth: 280,
      cardContainerWidth: 0
    };
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
    this.getWidth();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize () {
    this.getWidth();
  }

  getWidth () {
    if (this.cardsWrapper) {
      if (window.outerWidth <= 640 && window.outerWidth > 425) {
        this.setState({ cardWidth: (this.cardsWrapper.clientWidth - 64) / 2 });
      } else if (window.outerWidth <= 425) {
        this.setState({ cardWidth: (this.cardsWrapper.clientWidth - 32) / 2 });
      } else {
        this.setState({ cardWidth: 280 });
      }
    }

    if (this.cardsContainer) {
      this.setState({ cardContainerWidth: this.cardsContainer.masonry.element.clientWidth });
    }
  }

  render () {
    const { spotts, loadMore, location } = this.props;
    const { cardWidth, cardContainerWidth } = this.state;

    return (
      <div ref={(ref) => { this.cardsWrapper = ref; }} styleName='cards-wrapper' >
        <Masonry className={cardContainerWidth < cardWidth * 4 && cardWidth === 280 && styles['left-align']} disableImagesLoaded options={{ transitionDuration: 100, isFitWidth: true }} ref={(ref) => { this.cardsContainer = ref; }} styleName='cards-container' >
          {spotts.get('data') && spotts.get('data').valueSeq().map((item, index) =>
          <div key={`home_card_${item.get('uuid')}_${index}`} styleName='card-selector'><Card item={item} key={`home_card_${item.get('uuid')}_${index}`} location={location} spottId={item.get('uuid')} width={cardWidth} /></div>
          )}
        </Masonry>
        {Boolean(spotts.get('_status') !== FETCHING && spotts.get('totalResultCount') &&
          spotts.get('totalResultCount') > spotts.get('pageSize') &&
          spotts.get('page') + 1 !== spotts.get('pageCount')) &&
          <div styleName='load-more' onClick={loadMore.bind(this, spotts.get('page') + 1)}>Load more...</div>
        }
      </div>
    );
  }
}
