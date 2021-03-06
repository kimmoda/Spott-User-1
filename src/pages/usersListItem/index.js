/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push as routerPush } from 'react-router-redux';
import { Link } from 'react-router';
import localized from '../_common/localized';
import { IconAvatar, IconCheck } from '../icons';
import * as actions from '../actions';
import { backgroundImageStyle, getDetailsDcFromLinks } from '../../utils';

const styles = require('./index.scss');

@localized
@connect(null, (dispatch) => ({
  loadUserProfile: bindActionCreators(actions.loadUserProfile, dispatch),
  removeUserFollowing: bindActionCreators(actions.removeUserFollowing, dispatch),
  setUserFollowing: bindActionCreators(actions.setUserFollowing, dispatch),
  routerPush: bindActionCreators(routerPush, dispatch)
}))
@CSSModules(styles, { allowMultiple: true })
export default class UserListItem extends Component {
  static propTypes = {
    activityFeedMode: PropTypes.bool,
    currentLocale: PropTypes.string.isRequired,
    currentUserId: PropTypes.string,
    item: PropTypes.any.isRequired,
    loadUserProfile: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    removeUserFollowing: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired,
    setUserFollowing: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    updateUserProfileOnAction: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      following: this.props.item.get('followingUser')
    };
  }

  componentWillReceiveProps (nextProps) {
    this.state = {
      following: nextProps.item.get('followingUser')
    };
  }

  async onFollowClick (following) {
    const { currentUserId, updateUserProfileOnAction, loadUserProfile } = this.props;
    const userId = this.props.item.get('uuid');
    if (currentUserId) {
      this.setState({
        following: !this.state.following
      });
      try {
        if (following) {
          await this.props.removeUserFollowing({ uuid: currentUserId, data: { uuid: userId } });
        } else {
          await this.props.setUserFollowing({ uuid: currentUserId, data: { uuid: userId } });
        }
        if (updateUserProfileOnAction) {
          loadUserProfile({ uuid: currentUserId });
        }
      } catch (error) {
        this.setState({
          following: !this.state.following
        });
        throw error;
      }
    } else {
      this.props.routerPush({ pathname: `/${this.props.currentLocale}/login`, state: { modal: true, returnTo: ((this.props.location && `${this.props.location.pathname}${this.props.location.search}`) || '/') } });
    }
  }

  render () {
    const { currentLocale, item, currentUserId, t, activityFeedMode } = this.props;
    const { following } = this.state;
    return (
      <div className={activityFeedMode && styles['people-activity-feed']} styleName='people'>
        <Link styleName='people-left' to={{
          pathname: `/${currentLocale}/profile/${item.get('uuid')}`,
          state: { dc: getDetailsDcFromLinks(item.get('links').toJS()) }
        }}>
          <div
            style={backgroundImageStyle(item.getIn([ 'avatar', 'url' ]), 32, 32)}
            styleName='people-avatar'>
            {!item.getIn([ 'avatar', 'url' ]) && <IconAvatar/>}
          </div>
          <div styleName='people-name'>
            {`${item.get('firstName')} ${item.get('lastName')}`}
            {activityFeedMode && <span styleName='people-following-you'>started following you.</span>}
          </div>
        </Link>
        {currentUserId !== item.get('uuid') &&
          <div
            className={following && styles['people-follow-active']}
            styleName='people-follow'
            onClick={this.onFollowClick.bind(this, following)}>
            <span>{following ? t('common.following') : t('common.follow')}</span>
            <i><IconCheck/></i>
          </div>}
      </div>
    );
  }
}
