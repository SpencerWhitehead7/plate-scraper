import React, { useState } from 'react'
import { connect } from 'react-redux'

import { login as loginAction } from 'reducers'
import { CardTitle } from 'comps/Card'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'

const LoginForm = ({ className, login, loginError }) => {
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [err, setErr] = useState({})

  const handleSubmit = evt => {
    evt.preventDefault()
    if (!email || !password) {
      setErr({ ...err, missingField: true })
    } else {
      login(email, password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <CardTitle>Login</CardTitle>
      {/* this jank bs sets error states in conjunction with redux */}
      {loginError.status !== err.status && setErr({ ...err, ...loginError })}
      {err.status && (
        <span>
          {`Error: ${err.status} ${err.statusText}`}
          <br />
          {`${err.data}`}
        </span>
      )}

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

const mstp = state => ({
  loginError: state.auth.loginError,
})

const mdtp = dispatch => ({
  login: (email, password) => dispatch(loginAction(email, password)),
})

export default connect(mstp, mdtp)(LoginForm)
