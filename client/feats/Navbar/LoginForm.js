import React, { useState } from 'react'
import { connect } from 'react-redux'

import { login } from '../../redux/rootReducer'

const LoginForm = ({ login, loginError }) => {
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
    <>
      {/* this jank bs sets error states in conjunction with redux */}
      {loginError.status !== err.status && setErr({ ...err, ...loginError })}
      {err.status && (
        <span>
          {`Error: ${err.status} ${err.statusText}`}
          <br />
          {`${err.data}`}
        </span>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          {err.missingField && !email && <span>Email Required</span>}
          <input
            type="text"
            name="email"
            value={email}
            onChange={evt => setEmail(evt.target.value)}
          />
        </label>
        <label>
          Password:
          {err.missingField && !password && <span>Password Required</span>}
          <input
            type="password"
            name="password"
            value={password}
            onChange={evt => setPassword(evt.target.value)}
          />
        </label>
        <button type="submit">
          Login
        </button>
      </form>
    </>
  )
}

const mstp = state => ({
  loginError: state.loginError,
})

const mdtp = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
})

export default connect(mstp, mdtp)(LoginForm)
