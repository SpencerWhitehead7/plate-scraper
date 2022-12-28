import React from "react"

import s from "./Card.scss"

type Props = {
  children: string
}

export const CardSubtitle: React.FC<Props> = ({ children }) => (
  <h5 className={s.card__subtitle}>{children}</h5>
)
