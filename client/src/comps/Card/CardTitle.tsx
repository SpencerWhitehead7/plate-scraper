import React from "react"

import s from "./Card.module.scss"

type Props = {
  children: string
}

export const CardTitle: React.FC<Props> = ({ children }) => (
  <h4 className={s.card__title}>{children}</h4>
)
