import React, { useState } from 'react'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'

const AccountSettings = ({ destroyMe }) => {
  const [password, setPassword] = useState(``)

  const handleSubmit = async evt => {
    try {
      evt.preventDefault()
      await destroyMe(password)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
        disabled={!password}
      >
        Destroy (Are you sure? This cannot be undone)
      </button>
    </form>
  )
}

const mdtp = dispatch => ({
  destroyMe: password => dispatch(authAsyncHandler.call({ password, isDestroy: true })),
})

export default connect(null, mdtp)(AccountSettings)
