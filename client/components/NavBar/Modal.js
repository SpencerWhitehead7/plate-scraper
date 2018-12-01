import React, {useState} from 'react'

import LoginForm from './LoginForm'

import s from './NavBar.css'

const Modal = props => {
  const {toggleModal} = props
  return (
    <div
      className={s.modal}
      onClick={toggleModal}
    >
      <section
        className={s.modalMain}
        onClick={event => {event.stopPropagation()}}
      >
        <LoginForm
          toggleModal={toggleModal}
        />
      </section>
    </div>
  )
}

export default Modal
