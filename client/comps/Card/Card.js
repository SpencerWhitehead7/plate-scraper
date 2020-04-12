import React from 'react'

import LoadingIndicator from '../LoadingIndicator'

import s from './Card.scss'

const Card = ({ isLoaded = true, children, ...restProps }) => (
  <div className={s.card} {...restProps}>
    {isLoaded ? children : <LoadingIndicator />}
  </div>
)

export default Card
