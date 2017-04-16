/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localized from '../../../_common/localized';
import { IconHeart, IconForward } from '../icons';
import CardModal from '../cardModal';
import CardMarkers from '../cardMarkers';
import Users from '../users/index';
import * as actions from '../../actions';

const styles = require('./index.scss');

@localized
@connect(null, (dispatch) => ({
  removeSpottLover: bindActionCreators(actions.removeSpottLover, dispatch),
  setSpottLover: bindActionCreators(actions.setSpottLover, dispatch)
}))
@CSSModules(styles, { allowMultiple: true })
export default class Card extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    removeSpottLover: PropTypes.func.isRequired,
    setSpottLover: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCardClick = ::this.onCardClick;
    this.onCardMarkerClick = ::this.onCardMarkerClick;
    this.onCardModalClose = ::this.onCardModalClose;
    this.state = {
      isCardModalOpen: false,
      isCardModalSidebar: false
    };
    this.images = [
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/b86c71a8-aa71-41e6-a613-41b41287266f?height=280&width=249',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/5b447383-ed89-40e7-a71a-a19788a00406?height=280&width=220',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/1e998ee2-872f-433e-b992-2e5d9fa6ebaf?height=280&width=350',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/ecf7bfc9-2951-47aa-9759-d3ef07958448?height=280&width=400',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/16e5e79c-5b08-41a3-ada6-ccda9c8c150c?height=280&width=200',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/3f1d46bf-8357-43bd-8e43-e483ac6d832c?height=280&width=190',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/c61222a6-70d2-4d64-b81f-f5e30a9cab19?height=280&width=430',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/9ddbb426-f19e-44cb-8239-b9b6ff12adba?height=280&width=215',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/2202ee0a-f3be-4e58-a448-57cf30d88d4e?height=280&width=390',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/dffd478a-6123-4c72-a12b-e25dead1faec?height=280&width=310',
      'https://spott-ios-rest-prd.appiness.mobi/spott/rest/v003/image/images/aeaf0679-d3a6-4d9a-b304-880059ab007a?height=280&width=290'
    ];

    this.users = [
      'http://lorempixel.com/26/26/people/1',
      'http://lorempixel.com/26/26/abstract/1',
      'http://lorempixel.com/26/26/abstract/2',
      'http://lorempixel.com/26/26/abstract/3',
      'http://lorempixel.com/26/26/abstract/4',
      'http://lorempixel.com/26/26/abstract/5',
      'http://lorempixel.com/26/26/abstract/6',
      'http://lorempixel.com/26/26/abstract/7',
      'http://lorempixel.com/26/26/abstract/8',
      'http://lorempixel.com/26/26/abstract/9',
      'http://lorempixel.com/26/26/abstract/10'
    ];
  }

  onCardClick () {
    this.setState({ isCardModalOpen: true });
  }

  onCardMarkerClick () {
    this.setState({
      isCardModalOpen: true,
      isCardModalSidebarOpen: true
    });
  }

  onCardModalClose () {
    this.setState({
      isCardModalOpen: false,
      isCardModalSidebarOpen: false
    });
  }

  onLoveClick (spottId, loved) {
    if (loved) {
      this.props.removeSpottLover({ uuid: spottId });
    } else {
      this.props.setSpottLover({ uuid: spottId });
    }
  }

  render () {
    const { item } = this.props;

    return (
      <div styleName='card'>
        {this.state.isCardModalOpen && <CardModal imageThumb={`${item.getIn([ 'image', 'url' ])}?width=280&height=280`} isSidebarOpen={this.state.isCardModalSidebarOpen} spottId={item.get('uuid')} onClose={this.onCardModalClose}/>}
        <div styleName='image' onClick={this.onCardClick}>
          <img src={`${item.getIn([ 'image', 'url' ])}?width=280&height=280`}/>
          <CardMarkers onImageClick={this.onCardClick} onMarkerClick={this.onCardMarkerClick} />
          <Link
            style={{ backgroundImage: `url(${this.users[Math.floor(Math.random() * this.users.length)]})` }}
            styleName='person' to='#'/>
        </div>
        <div styleName='content'>
          <div styleName='click-overlay' onClick={this.onCardClick}/>
          <div styleName='reason'>
            Because you subscribed to Chicago Med
          </div>
          <h3 styleName='title'>{item.get('title')}</h3>
          <div styleName='description'>
            Taken from Season 2 Episode 5 — Extreme Measures
          </div>
          <div styleName='topic-links'>
            {item.get('topics').map((topic, index) =>
              <Link key={`c_topic_${index}_${topic.get('uuid')}`} styleName='topic-link' to='#'>{topic.get('text')}</Link>
            )}
          </div>
        </div>
        <div styleName='footer'>
          <div styleName='click-overlay' onClick={this.onCardClick}/>
          <div styleName='likes' onClick={this.onLoveClick.bind(this, item.get('uuid'), item.get('loved'))}>
            <i><IconHeart/></i>
            <span>24</span>
          </div>
          <div styleName='users'>
            <Users maxNum={5}/>
          </div>
          <Link styleName='moar' to='#'>
            <i><IconForward/></i>
          </Link>
        </div>
      </div>
    );
  }
}
