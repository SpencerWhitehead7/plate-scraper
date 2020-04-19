import React, { useState } from 'react'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { CardTitle } from 'comps/Card'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'

const SignupForm = ({ className, signup }) => {
  const [email, setEmail] = useState(``)
  const [userName, setUserName] = useState(``)
  const [password, setPassword] = useState(``)
  const [err, setErr] = useState({})

  const handleSubmit = evt => {
    evt.preventDefault()
    if (!email || !password || !userName) {
      setErr({ missingField: true })
    } else {
      signup(email, password, userName)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <CardTitle>Signup</CardTitle>

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

const mdtp = dispatch => ({
  signup: (email, userName, password) => dispatch(authAsyncHandler.call({ email, userName, password })),
})

export default connect(null, mdtp)(SignupForm)
