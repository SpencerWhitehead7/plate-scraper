import React from "react"

import s from "./ButtonSection.scss"

type Props = {
  children: React.ReactNode
}

export const ButtonSection: React.FC<Props> = ({ children }) => (
  <div className={s.buttonSection}>{children}</div>
)
