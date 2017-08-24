import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import localized from '../../../_common/localized';
import SEOWidget from '../../../_common/seoWidget';
import LegalPages from '../index';

const styles = require('./index.scss');

@localized
@CSSModules(styles, { allowMultiple: true })
export default class Privacy extends Component {

  static propTypes = {
    getLocalizedResource: PropTypes.func.isRequired,
    history: PropTypes.object,
    location: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const { location, history, t } = this.props;

    return (
      <LegalPages history={history} location={location}>
        <section styleName='content'>
          <div dangerouslySetInnerHTML={{ __html: this.props.getLocalizedResource('privacy') }}/>
        </section>
        <SEOWidget description={t('seo.privacy.description')} title={`${t('seo.title')} - ${t('seo.privacy.title')}`}/>
      </LegalPages>
    );
  }
}
