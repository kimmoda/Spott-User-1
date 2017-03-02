/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import { Button, pinkButtonStyle, Modal, smallDialogStyle, greyButtonStyle } from '../../../_common/buildingBlocks';
import localized from '../../../_common/localized';
import Radium from 'radium';
import { reduxForm, Field } from 'redux-form/immutable';
import { st } from '../styles';
import { validateCardFrom } from '../../validateForm';
import { renderField } from '../index';
import { CardNumber, CvvNumber } from '../formFields';
import '../cardsIcons.css';

@reduxForm({
  form: 'basketCardForm',
  validate: validateCardFrom
})
@localized
@Radium
export class ModalCardForm extends Component {
  static propTypes = {
    addNewAddress: PropTypes.func.isRequired,
    addresses: PropTypes.any,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.any,
    isEditForm: PropTypes.bool,
    removeCard: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  render () {
    const { handleSubmit, onClose, error, addresses, addNewAddress, submitting, submitFailed, t, removeCard, isEditForm, initialValues } = this.props;

    return (
      <Modal
        isOpen
        style={smallDialogStyle}
        onClose={onClose}>
        <div style={st.modal}>
          <div style={st.modal.title}>
            {isEditForm ? t('basket.editCard') : t('basket.addNewCard')}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={st.modal.form}>
              <div style={st.modal.formRow}>
                <label style={st.modal.label}>{t('basket.creditCardNumber')}</label>
                <Field
                  cardType={initialValues.getIn([ 'cardType', 'code' ])}
                  component={CardNumber}
                  name='number'
                  props={{ required: true, type: 'text' }}
                  submitFailed={submitFailed}/>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '160px' }}>
                  <label style={st.modal.label}>{t('basket.expirationDate')}</label>
                  <div style={{ display: 'flex' }}>
                    <Field
                      component={renderField}
                      name='expiryMonth'
                      props={{ required: true, placeholder: 'MM' }}
                      style={st.modal.input}
                      submitFailed={submitFailed}/>
                    <Field
                      component={renderField}
                      name='expiryYear'
                      props={{ required: true, placeholder: 'YY' }}
                      style={st.modal.input}
                      submitFailed={submitFailed}/>
                  </div>
                </div>
                <div style={{ width: '100px', marginLeft: '10px' }}>
                  <label style={st.modal.label}>CVC</label>
                  <Field
                    component={CvvNumber}
                    name='cvv'
                    props={{ required: true }}
                    submitFailed={submitFailed}/>
                </div>
              </div>
              <div style={st.modal.formRow}>
                <label style={st.modal.label}>{t('basket.nameOnCard')}</label>
                <Field
                  component={renderField}
                  name='name'
                  props={{ required: true, type: 'text' }}
                  style={st.modal.input}
                  submitFailed={submitFailed}/>
              </div>
              {isEditForm &&
              <Field
                component='input'
                name='id'
                style={st.modal.input}
                type='hidden'/>}
            </div>
            <div style={[ st.modal.items, { marginTop: '-20px', borderTop: 0 } ]}>
              <div style={[ st.modal.item, { borderBottom: 0 } ]}>
                <label style={st.modal.label}>{t('basket.billingAddress')}</label>
              </div>
              {addresses.map((address) =>
                <div key={address.get('id')} style={st.modal.item}>
                  <label style={st.modal.label}>
                    <Field
                      component='input'
                      disabled={submitting}
                      name='addressId'
                      type='radio'
                      value={address.get('id')}/>
                    <div style={st.modal.radioContent}>
                      <div style={st.modal.radioContent.title}>
                        {address.get('title')} {address.get('firstname')} {address.get('lastname')}
                      </div>
                      <div style={st.modal.radioContent.dscr}>
                        {address.get('line1')} {address.get('houseNumber')}<br/>
                        {address.get('line2') && <div>{address.get('line2')}</div>}
                        {address.get('postcode')} {address.get('city')}, {address.get('country')}<br/>
                        {address.get('phoneCountry')}{address.get('phone')}
                      </div>
                    </div>
                  </label>
                </div>
              )}
              <div style={st.modal.item}>
                <div style={st.modal.addNewLink} onClick={addNewAddress}>{t('basket.addNewAddress')}</div>
              </div>
            </div>
            {error && typeof error.message === 'string' && <div style={st.modal.error}>{error.message}</div>}
            <div style={st.modal.buttons}>
              {isEditForm &&
              <div style={st.modal.buttons.remove} onClick={removeCard.bind(this, initialValues.get('id'))}>
                Remove Card
              </div>}
              <button key='cbtn' style={[ greyButtonStyle, st.modal.btn, st.modal.buttons.btn ]} onClick={onClose}>
                {t('basket.cancel')}
              </button>
              <Button key='sbtn' style={[ pinkButtonStyle, st.modal.btn, st.modal.buttons.btn ]}>
                {t('basket.save')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

@reduxForm({
  form: 'basketCardSelectForm'
})
@localized
@Radium
export class ModalCardSelectForm extends Component {
  static propTypes = {
    addNewCard: PropTypes.func.isRequired,
    cards: PropTypes.any,
    editCard: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.any,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  render () {
    const { handleSubmit, onSubmit, onClose, error, submitting, cards, addNewCard, editCard, t } = this.props;

    return (
      <Modal
        isOpen
        style={smallDialogStyle}
        onClose={onClose}>
        <div style={st.modal}>
          <div style={st.modal.title}>{t('basket.selectPaymentMethod')}</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={st.modal.items}>
              <div style={st.modal.item}>
                <div style={st.modal.addNewLink} onClick={addNewCard}>{t('basket.addNewCard')}</div>
              </div>
              {cards.map((card) =>
                <div key={card.get('id')} style={st.modal.item}>
                  <label style={st.modal.label}>
                    <Field
                      component='input'
                      disabled={submitting}
                      name='cardId'
                      type='radio'
                      value={card.get('id')}/>
                    <div style={st.modal.radioContent}>
                      <div style={st.modal.radioContent.title}>
                        <div style={st.paymentCard.select}>
                          <div
                            className={`icon-${card.getIn([ 'cardType', 'code' ])}`}
                            style={st.paymentCard.select.icon}/>
                          <div style={st.paymentCard.select.right}>
                            <div style={st.paymentCard.select.number}>
                              <div style={st.paymentCard.select.number.dots}>XXX XXX XXX&nbsp;</div>
                              {card.get('maskedNumber').slice(-4)}
                            </div>
                            <div style={st.paymentCard.select.name}>
                              {card.getIn([ 'cardType', 'code' ])}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={st.modal.radioContent.dscr}>
                        {card.get('name')}
                      </div>
                    </div>
                    <div style={st.modal.radioEdit} onClick={editCard.bind(this, card.get('id'))}>{t('basket.edit')}</div>
                  </label>
                </div>
              )}
              {error && typeof error.message === 'string' && <div style={st.modal.error}>{error.message}</div>}
            </div>
            <div style={st.modal.buttons}>
              <Button style={[ pinkButtonStyle, st.modal.btn ]}>
                {t('basket.save')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}