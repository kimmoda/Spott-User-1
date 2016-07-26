import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router';
import { colors, fontWeights, makeTextStyle, Money } from '../../../_common/buildingBlocks';
import VerticalTiles from '../../../_common/verticalTiles';
import { productsOfWishlistSelector } from '../../selector';
import { loadProductsOfWishlist } from '../../actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { ERROR, FETCHING, LOADED, UPDATING } from '../../../../data/statusTypes';
import Spinner from '../../../_common/spinner';
import localized from '../../../_common/localized';
import { slugify } from '../../../../utils';
import BaseTile from '../../../_common/tiles/_baseTile';

const RadiumLink = Radium(Link);

const itemStyles = {
  container: {
    backgroundColor: colors.white,
    display: 'block',
    textDecoration: 'none'
  },
  image: {
    width: '100%',
    paddingBottom: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  },
  name: {
    ...makeTextStyle(fontWeights.medium, '0.875em'),
    color: colors.slateGray,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: '1.1428em',
    paddingTop: '1.1428em',
    paddingRight: '1.1428em'
  },
  price: {
    ...makeTextStyle(fontWeights.bold, '0.875em'),
    color: colors.dark,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingTop: '0.1875em',
    paddingLeft: '1.1428em',
    paddingBottom: '1.1428em',
    paddingRight: '1.1428em'
  }
};
@localized
class WishlistProduct extends Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    item: ImmutablePropTypes.mapContains({
      _status: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      image: ImmutablePropTypes.mapContains({
        url: PropTypes.string.isRequired
      }),
      price: ImmutablePropTypes.mapContains({
        amount: PropTypes.number,
        currency: PropTypes.string
      }),
      shortName: PropTypes.string.isRequired
    }),
    style: PropTypes.object,
    t: PropTypes.func.isRequired
  }

  render () {
    const { currentLocale, item, style } = this.props;
    if (item.get('_status') === LOADED || item.get('_status') === UPDATING) {
      return (
        <BaseTile style={style}>
          <RadiumLink style={itemStyles.container} to={`/${currentLocale}/product/${slugify(item.get('shortName'))}/${item.get('id')}`}>
            <div style={{ ...itemStyles.image, backgroundImage: item.get('image') ? `url(${item.getIn([ 'image', 'url' ])})` : 'none' }}></div>
            <p style={itemStyles.name}>{item.get('shortName') || '\u00a0'}</p>
            <p style={itemStyles.price}><Money amount={item.getIn([ 'price', 'amount' ])} currency={item.getIn([ 'price', 'currency' ])} /></p>
          </RadiumLink>
        </BaseTile>
      );
    }
    return <div></div>;
  }
}

const styles = {
  emptyText: {
    ...makeTextStyle(fontWeights.medium, '0.875em'),
    color: colors.slateGray
  },
  title: {
    ...makeTextStyle(fontWeights.light, '1.4375em', '0.02174em'),
    color: colors.dark,
    paddingBottom: '1.30435em'
  }
};
@localized
@connect(productsOfWishlistSelector, (dispatch) => ({
  loadProductsOfWishlist: bindActionCreators(loadProductsOfWishlist, dispatch)
}))
export default class WishlistProducts extends Component {
  static propTypes = {
    loadProductsOfWishlist: PropTypes.func.isRequired,
    params: PropTypes.shape({
      wishlistId: PropTypes.string.isRequired
    }),
    productsOfWishlist: ImmutablePropTypes.mapContains({
      _status: PropTypes.string.isRequired,
      data: ImmutablePropTypes.list
    }),
    t: PropTypes.func.isRequired,
    wishlist: ImmutablePropTypes.mapContains({
      name: PropTypes.string
    })
  };

  componentWillMount () {
    // (Re)fetch the wishlist.
    this.props.loadProductsOfWishlist(this.props.params.wishlistId);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.wishlistId !== nextProps.params.wishlistId) {
      this.props.loadProductsOfWishlist(nextProps.params.wishlistId);
    }
  }

  render () {
    const { productsOfWishlist, t, wishlist } = this.props;
    if (productsOfWishlist.get('_status') === FETCHING) {
      return (<Spinner />);
    }
    if (productsOfWishlist.get('_status') === LOADED || productsOfWishlist.get('_status') === UPDATING) {
      if (productsOfWishlist.get('data').size > 0) {
        return (
          <div style={styles.content}>
            <h1 style={styles.title}>{wishlist.get('name') || t('profile.wishlists.unnamedWishlist')}</h1>
            <VerticalTiles
              aspectRatio={1.38876}
              horizontalSpacing={30}
              items={productsOfWishlist.get('data')}
              numColumns={{ 0: 2, 480: 3, 768: 4, 992: 5 }}
              tile={<WishlistProduct />}
              verticalSpacing={30} />
          </div>
        );
      }

      return (
        <div>
          <h1 style={styles.title}>{wishlist.get('name') || t('profile.wishlists.unnamedWishlist')}</h1>
          <p style={styles.emptyText}>{t('profile.wishlistProducts.empty')}</p>
        </div>
      );
    }

    if (productsOfWishlist.get('_status') === ERROR && productsOfWishlist.get('_error').name === 'UnauthorizedError') {
      return (
        <div>
          <h1 style={styles.title}>{t('profile.wishlists.unnamedWishlist')}</h1>
          <p style={styles.emptyText}>{t('profile.wishlistProducts.private')}</p>
        </div>
      );
    }

    return (<div></div>);
  }
}
