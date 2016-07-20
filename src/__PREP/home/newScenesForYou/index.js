import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, Container, SectionTitle } from '../../../_common/buildingBlocks';
// import { dummySelector } from '../../selectors';
// import { dummy } from '../../actions';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import SceneTiles from '../../../_common/tiles/sceneTiles';
import localized from '../../../_common/localized';
import { fromJS } from 'immutable';
import scenes from '../../../../api/mock/scenes';

@localized
@Radium
export default class NewScenesForYou extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired
  }

  static styles = {
    wrapper: {
      backgroundColor: colors.white,
      paddingTop: '6.25em',
      paddingBottom: '3.125em'
    },
    list: {
      marginLeft: '-0.938em',
      marginRight: '-0.938em'
    }
  };

  render () {
    const { t } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={styles.wrapper}>
        <Container>
          <SceneTiles items={scenes} listStyle={styles.list} title={t('home.newScenesForYou.title')} />
        </Container>
      </div>
    );
  }

}