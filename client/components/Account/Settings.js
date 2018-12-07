import React, {useState} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'

import {me} from '../../redux/rootReducer'

import s from './Account.css'

const LoginForm = props => {
  const [authentication, setAuthentication] = useState(``)
  const [email, setEmail] = useState(``)
  const [userName, setUserName] = useState(``)
  const [password, setPassword] = useState(``)
  const [passwordConfirm, setPasswordConfirm] = useState(``)

  const handleSubmit = async evt => {
    try{
      evt.preventDefault()
      const newInfo = {}
      if(email) newInfo.email = email
      if(userName) newInfo.userName = userName
      if(password) newInfo.password = password
      const body = {
        newInfo,
        password : authentication,
      }
      const {data} = await axios.put(`/api/user`, body)
      console.log(data)
      await props.me()
    }catch(err){
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Current password (for authentication):
        <input
          type="password"
          name="authentication"
          value={authentication}
          onChange={evt => setAuthentication(evt.target.value)}
        />
        {!authentication && <span>Required</span>}
      </label>
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          name="userName"
          value={userName}
          onChange={evt => setUserName(evt.target.value)}
        />
      </label>
      <label>
        Password:
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
        <input
          type="password"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={evt => setPasswordConfirm(evt.target.value)}
        />
        {password !== passwordConfirm && <span>Passwords do not match</span>}
      </label>
      <button
        type="submit"
        disabled={!authentication || password !== passwordConfirm}
      >
        Edit Info
      </button>
    </form>
  )
}

const mdtp = dispatch => ({
  me : () => dispatch(me()),
})

export default connect(null, mdtp)(LoginForm)
