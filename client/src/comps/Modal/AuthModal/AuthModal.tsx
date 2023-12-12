import classnames from "classnames"
import React from "react"

import skele from "@/skeleton.module.css"

import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

export const AuthModal: React.FC = () => (
  <div className={skele.container}>
    <div className={skele.row}>
      <LoginForm className={classnames(skele["one-half"], skele.column)} />
      <SignupForm className={classnames(skele["one-half"], skele.column)} />
    </div>
  </div>
)
