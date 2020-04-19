import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'

const AccountSettings = ({ fetchMe }) => {
  const [auth, setAuth] = useState(``)
  const [email, setEmail] = useState(``)
  const [userName, setUserName] = useState(``)
  const [password, setPassword] = useState(``)
  const [passwordConfirm, setPasswordConfirm] = useState(``)

  const handleSubmit = async evt => {
    try {
      evt.preventDefault()
      const newInfo = {}
      if (email) newInfo.email = email
      if (userName) newInfo.userName = userName
      if (password) newInfo.password = password
      const body = {
        newInfo,
        password: auth,
      }
      await axios.put(`/api/user`, body)
      await fetchMe()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">
        New email
      </label>
      <input
        id="email"
        type="text"
        name="email"
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />

      <label htmlFor="userName">
        New username
      </label>
      <input
        id="userName"
        type="text"
        name="userName"
        autoComplete="off"
        value={userName}
        onChange={evt => setUserName(evt.target.value)}
      />

      <label htmlFor="password">
        New password
      </label>
      <input
        id="password"
        type="password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={evt => {
          setPassword(evt.target.value)
        }}
      />

      <label htmlFor="passwordConfirm">
        Confirm new password
      </label>
      <input
        id="passwordConfirm"
        type="password"
        name="passwordConfirm"
        autoComplete="new-password"
        value={passwordConfirm}
        onChange={evt => setPasswordConfirm(evt.target.value)}
      />
      {password !== passwordConfirm && <span>Passwords do not match</span>}

      <label htmlFor="auth">
        Authenticate with current password (Required)
      </label>
      <input
        id="auth"
        type="password"
        name="auth"
        autoComplete="off"
        value={auth}
        onChange={evt => setAuth(evt.target.value)}
      />

      <button
        type="submit"
        disabled={!auth || password !== passwordConfirm}
      >
        Save
      </button>
    </form>
  )
}

const mdtp = dispatch => ({
  fetchMe: () => dispatch(authAsyncHandler.call()),
})

export default connect(null, mdtp)(AccountSettings)
