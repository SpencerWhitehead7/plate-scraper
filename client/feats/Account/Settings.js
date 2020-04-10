import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import { me } from '../../redux/rootReducer'

const LoginForm = props => {
  const [authentication, setAuthentication] = useState(``)
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState(``)
  const [showUserName, setShowUserName] = useState(false)
  const [userName, setUserName] = useState(``)
  const [showPassword, setShowPassword] = useState(false)
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
        password: authentication,
      }
      await axios.put(`/api/user`, body)
      await props.me()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Current password (for authentication):
        {` `}
        <input
          type="password"
          name="authentication"
          value={authentication}
          onChange={evt => setAuthentication(evt.target.value)}
        />
        {!authentication && <span>Required</span>}
      </label>
      <ShowHide
        name="Email"
        status={showEmail}
        setStatus={setShowEmail}
        setValue={() => setEmail(``)}
      />
      {showEmail && (
        <label>
          Email:
          {` `}
          <input
            type="text"
            name="email"
            value={email}
            onChange={evt => setEmail(evt.target.value)}
          />
        </label>
      )}
      <ShowHide
        name="Username"
        status={showUserName}
        setStatus={setShowUserName}
        setValue={() => setUserName(``)}
      />
      {showUserName && (
        <label>
          Username:
          {` `}
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={evt => setUserName(evt.target.value)}
          />
        </label>
      )}
      <ShowHide
        name="Password"
        status={showPassword}
        setStatus={setShowPassword}
        setValue={() => {
          setPassword(``)
          setPasswordConfirm(``)
        }}
      />
      {showPassword && (
        <>
          <label>
            Password:
            {` `}
            <input
              type="password"
              name="password"
              value={password}
              onChange={evt => {
                setPassword(evt.target.value)
              }}
            />
          </label>
          <label>
            Confirm password:
            {` `}
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={evt => setPasswordConfirm(evt.target.value)}
            />
            {password !== passwordConfirm && <span>Passwords do not match</span>}
          </label>
        </>
      )}
      <button
        type="submit"
        disabled={!authentication || password !== passwordConfirm}
      >
        Edit Info
      </button>
    </form>
  )
}

const ShowHide = ({ name, status, setStatus, setValue }) => (
  <button
    type="button"
    onClick={() => {
      setStatus(!status)
      setValue()
    }}
  >
    {status ? `Cancel` : `Change ${name}`}
  </button>
)


const mdtp = dispatch => ({
  me: () => dispatch(me()),
})

export default connect(null, mdtp)(LoginForm)
