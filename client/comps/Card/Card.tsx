import React from 'react'

import { LoadingIndicator } from '@/comps/LoadingIndicator'

import s from './Card.scss'

type Props = {
  isLoaded?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<Props> = ({ isLoaded = true, children, ...restProps }) => (
  <div className={s.card} {...restProps}>
    {isLoaded ? children : <LoadingIndicator />}
  </div>
)
