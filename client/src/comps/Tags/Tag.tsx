import { Link } from "@tanstack/react-router"
import React from "react"

import { URL } from "@/consts"

import s from "./Tags.module.scss"

type Props = {
  name: string
  handleRemove?: (name: string) => void
}

export const Tag: React.FC<Props> = ({ name, handleRemove }) => (
  <li className={s.tag}>
    <Link {...URL.recipesAll([name])}>{name}</Link>
    {handleRemove && (
      <button
        type="button"
        className={s.tag__tagX}
        onClick={() => {
          handleRemove(name)
        }}
      >
        X
      </button>
    )}
  </li>
)
