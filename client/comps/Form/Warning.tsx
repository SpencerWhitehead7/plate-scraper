import classnames from "classnames"
import React from "react"
import { FieldError } from "react-hook-form"

import sg from "@/styles/index.scss"

import s from "./Form.scss"

type Props = {
  leftPadded?: boolean
  rhfError?: Partial<FieldError>
  customError?: string
}

export const Warning: React.FC<Props> = ({
  leftPadded = true,
  customError,
  rhfError,
}) =>
  customError ?? rhfError ? (
    <span className={classnames(s.form__warning, { [sg.pl_sest]: leftPadded })}>
      {customError ?? rhfError?.message ?? rhfError?.type ?? "error"}
    </span>
  ) : null
