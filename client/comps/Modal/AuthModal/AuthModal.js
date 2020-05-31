import React from 'react'
import classnames from 'classnames'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

import skele from 'skeleton.css'

const AuthModal = () => (
  <div className={skele.container}>
    <div className={skele.row}>
      <LoginForm className={classnames(skele[`one-half`], skele.column)} />
      <SignupForm className={classnames(skele[`one-half`], skele.column)} />
    </div>
  </div>
)

export default AuthModal
