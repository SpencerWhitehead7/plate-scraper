import React, { useState } from 'react'
import { connect } from 'react-redux'

import { signup as signupAction } from 'reducers'
import { CardTitle } from 'comps/Card'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'

const SignupForm = ({ className, signup, signupError }) => {
  const [email, setEmail] = useState(``)
  const [userName, setUserName] = useState(``)
  const [password, setPassword] = useState(``)
  const [err, setErr] = useState({})

  const handleSubmit = evt => {
    evt.preventDefault()
    if (!email || !password || !userName) {
      setErr({ ...err, missingField: true })
    } else {
      signup(email, userName, password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <CardTitle>Signup</CardTitle>
      {/* this jank bs sets error states in conjunction with redux */}
      {signupError.status !== err.status && setErr({ ...err, ...signupError })}
      {err.status && (
        <span>
          {`Error: ${err.status} ${err.statusText}`}
          <br />
          {`${err.data}`}
        </span>
      )}

      <label>
        Email
        {err.missingField && !email && <span className={sg.pl_ser}>Email Required</span>}
      </label>
      <input
        type="text"
        name="email"
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />

      <label>
        UserName
        {err.missingField && !userName && <span className={sg.pl_ser}>UserName Required</span>}
      </label>
      <input
        type="text"
        name="userName"
        autoComplete="off"
        value={userName}
        onChange={evt => setUserName(evt.target.value)}
      />

      <label>
        Password
        {err.missingField && !password && <span className={sg.pl_ser}>Password Required</span>}
      </label>
      <input
        type="password"
        name="password"
        autoComplete="off"
        value={password}
        onChange={evt => setPassword(evt.target.value)}
      />

      <button type="submit" className={skele[`button-primary`]}>
        Signup
      </button>
    </form>
  )
}

const mstp = state => ({
  signupError: state.auth.signupError,
})

const mdtp = dispatch => ({
  signup: (email, userName, password) => dispatch(signupAction(email, userName, password)),
})

export default connect(mstp, mdtp)(SignupForm)
