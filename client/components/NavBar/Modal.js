import React from 'react'
import { connect } from 'react-redux'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

import s from './NavBar.css'

const Modal = ({ toggleModal, user }) => (
  <>
    {user.id && toggleModal()}
    <div
      className={s.modal}
      onClick={toggleModal}
    >
      <section
        className={s.modalMain}
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

