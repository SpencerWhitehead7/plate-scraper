import React from "react"

import s from "./LoadingIndicator.module.scss"

export const LoadingIndicator: React.FC = () => (
  // TODO: customizable size
  <div className={s.loadingIndicator}>
    <div className={s.loadingIndicator__spinner} />
  </div>
)
