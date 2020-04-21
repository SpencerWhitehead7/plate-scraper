import React, { useState } from 'react'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'

const AccountSettings = ({ editMe }) => {
  const [password, setPassword] = useState(``)
  const [newEmail, setNewEmail] = useState(``)
  const [newUserName, setNewUserName] = useState(``)
  const [newPassword, setNewPassword] = useState(``)
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(``)

  const handleSubmit = async evt => {
    try {
      evt.preventDefault()
      const submitEmail = newEmail || undefined
      const submitUserName = newUserName || undefined
      const submitNewPassword = newPassword || undefined
      await editMe(submitEmail, submitUserName, submitNewPassword, password)
      setPassword(``)
      setNewEmail(``)
      setNewUserName(``)
      setNewPassword(``)
      setNewPasswordConfirm(``)
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
        value={newEmail}
        onChange={evt => { setNewEmail(evt.target.value) }}
      />

      <label htmlFor="userName">
        New username
      </label>
      <input
        id="userName"
        type="text"
        name="userName"
        autoComplete="off"
        value={newUserName}
        onChange={evt => { setNewUserName(evt.target.value) }}
      />

      <label htmlFor="password">
        New password
      </label>
      <input
        id="password"
        type="password"
        name="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={evt => { setNewPassword(evt.target.value) }}
      />

      <label htmlFor="passwordConfirm">
        Confirm new password
      </label>
      <input
        id="passwordConfirm"
        type="password"
        name="passwordConfirm"
        autoComplete="new-password"
        value={newPasswordConfirm}
        onChange={evt => { setNewPasswordConfirm(evt.target.value) }}
      />
      {newPassword !== newPasswordConfirm && <span>Passwords do not match</span>}

      <label htmlFor="auth">
        Authenticate with current password (Required)
      </label>
      <input
        id="auth"
        type="password"
        name="auth"
        autoComplete="off"
        value={password}
        onChange={evt => { setPassword(evt.target.value) }}
      />

      <button
        type="submit"
        disabled={!password || newPassword !== newPasswordConfirm}
      >
        Save
      </button>
    </form>
  )
}

const mdtp = dispatch => ({
  editMe: (newEmail, newUserName, newPassword, password) => dispatch(authAsyncHandler.call({ newEmail, newUserName, newPassword, password })),
})

export default connect(null, mdtp)(AccountSettings)
