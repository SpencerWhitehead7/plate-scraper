import React, {useState} from 'react'

import s from './NavBar.css'

const Modal = props => {
  const {toggleModal} = props
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  return (
    <div
      className={s.modal}
      onClick={toggleModal}
    >
      <section
        className={s.modalMain}
        onClick={event => {event.stopPropagation()}}
      >
        {/* forms for logging in and signing up also thunks somehow */}
        <button
          type="button"
          onClick={toggleModal}
        >
          Close
        </button>
      </section>
    </div>
  )
}

export default Modal
