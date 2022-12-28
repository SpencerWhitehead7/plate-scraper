import React from "react"
import { Link } from "react-router-dom"

import { URL } from "@/consts"

import s from "./Tags.scss"

type Props = {
  name: string
  handleRemove?: (name: string) => void
}

export const Tag: React.FC<Props> = ({ name, handleRemove }) => (
  <li className={s.tag}>
    <Link to={URL.search([name])}>{name}</Link>
    {handleRemove && (
      <button
        type="button"
        className={s.tag__tagX}
        onClick={() => handleRemove(name)}
      >
        X
      </button>
    )}
  </li>
)
