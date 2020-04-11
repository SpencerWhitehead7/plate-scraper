import React from 'react'
import { connect } from 'react-redux'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

import s from './Modal.scss'

const Modal = ({ toggleModal, user }) => (
  <>
    {user.id && toggleModal()}
    <div
      className={s.modal__background}
      onClick={toggleModal}
    >
      <section
        className={s.modal__content}
        onClick={event => { event.stopPropagation() }}
      >
        <LoginForm />
        <SignupForm />
      </section>
    </div>
  </>
)

const mstp = state => ({
  user: state.user,
})

export default connect(mstp, null)(Modal)

