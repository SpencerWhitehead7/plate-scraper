import React, {useState} from 'react'
import {connect} from 'react-redux'

import {signup} from '../../redux/rootReducer'

import s from './NavBar.css'

const SignupForm = props => {
  const {authError} = props
  const [email, setEmail] = useState(``)
  const [userName, setUserName] = useState(``)
  const [password, setPassword] = useState(``)
  const [err, setErr] = useState({})

  const handleSubmit = evt => {
    evt.preventDefault()
    if(!email || !password || !userName){
      setErr({missingField : true})
    }else{
      setErr({...authError})
      props.signup(email, userName, password)
    }
  }

  return (
    <>
      {/* this jank bs sets error states in conjunction with redux */}
      {authError.status !== err.status && setErr({...err, ...authError})}
      {err.status &&
      <span>
        {`Error: ${err.status} ${err.statusText}`}
        <br/>
        {`${err.data}`}
      </span>}
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
          UserName:
          {err.missingField && !userName && <span>UserName Required</span>}
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={evt => setUserName(evt.target.value)}
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
          Signup
        </button>
      </form>
    </>
  )
}

const mstp = state => ({
  authError : state.authError,
})

const mdtp = dispatch => ({
  signup : (email, userName, password) => dispatch(signup(email, userName, password)),
})

export default connect(mstp, mdtp)(SignupForm)
