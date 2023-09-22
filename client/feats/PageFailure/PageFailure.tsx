import React from "react"

import { Card } from "@/comps/Card"
import sg from "@/styles/index.module.scss"

type Props = {
  type?: "404" | "no user" | "no recipe" | ""
}

export const PageFailure: React.FC<Props> = ({ type = "" }) => {
  let title = ""
  let subtitle = ""
  switch (type) {
    case "404":
      title = "404 Page Not Found"
      subtitle = "Oh no, there's nothing here"
      break
    case "no user":
      title = "This user does not exist. It may have been deleted."
      subtitle = "Try a different user?"
      break
    case "no recipe":
      title = "This recipe does not exist. It may have been deleted."
      subtitle = "Try a different recipe?"
      break
    default:
      title = "something is wrong"
      subtitle = "sorry"
  }

  return (
    <Card>
      <h2 className={sg.textCenter}>{title}</h2>
      <h3 className={sg.textCenter}>{subtitle}</h3>
    </Card>
  )
}
