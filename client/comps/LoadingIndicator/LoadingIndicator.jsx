import React from 'react'

import s from './LoadingIndicator.scss'

const LoadingIndicator = () => ( // TODO: customizable size
  <div className={s.loadingIndicator}>
    <div className={s.loadingIndicator__spinner} />
  </div>
)
export default LoadingIndicator
