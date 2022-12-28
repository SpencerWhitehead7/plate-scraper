import React from "react"

import s from "./LoadingIndicator.scss"

export const LoadingIndicator = () => (
  // TODO: customizable size
  <div className={s.loadingIndicator}>
    <div className={s.loadingIndicator__spinner} />
  </div>
)
