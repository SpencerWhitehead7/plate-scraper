import React, { useState } from 'react'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { CardTitle } from 'comps/Card'
import { handleCloseModal } from '../modalReducer'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'

const LoginForm = ({ className, login }) => {
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [err, setErr] = useState({})

  const handleSubmit = evt => {
    evt.preventDefault()
    if (!email || !password) {
      setErr({ missingField: true })
    } else {
      login(email, password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <CardTitle>Login</CardTitle>

      <label htmlFor="email">
        Email
        {err.missingField && !email && <span className={sg.pl_ser}>Email Required</span>}
      </label>
      <input
        type="text"
        autoComplete="username"
        name="email"
        id="email"
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />

      <label>
        Password
        {err.missingField && !password && <span className={sg.pl_ser}>Password Required</span>}
      </label>
      <input
        type="password"
        autoComplete="current-password"
        name="password"
        value={password}
        onChange={evt => setPassword(evt.target.value)}
      />

      <button type="submit" className={skele[`button-primary`]}>
        Login
      </button>
    </form>
  )
}

const modalSubmitThunk = (email, password, dispatch) => {
  dispatch(authAsyncHandler.call({ email, password }))
}

const mdtp = dispatch => ({
  login: (email, password) => dispatch(handleCloseModal(modalSubmitThunk.bind(null, email, password))),
})

export default connect(null, mdtp)(LoginForm)
