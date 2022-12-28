import classnames from "classnames"
import React from "react"
import { FormState } from "react-hook-form"

import skele from "@/skeleton.css"

type Props = {
  formState: FormState<object>
  onClick: VoidFunction
  value: string
}

export const FormButton: React.FC<Props> = ({ formState, onClick, value }) => (
  <button
    type="button"
    onClick={onClick}
    className={classnames({ [skele["button-primary"]]: formState.isValid })}
  >
    {value}
  </button>
)
