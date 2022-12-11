import React from 'react'

import Card from '@/comps/Card'

import sg from '@/styles/index.scss'

type Props = {
  type?: `404` | `No such user` | `No such recipe` | ``
}

export const PageFailure: React.FC<Props> = ({ type = `` }) => {
  let title = ``
  let subtitle = ``
  switch (type) {
    case `404`:
      title = `404 Page Not Found.`
      subtitle = `Oh no, there's nothing here!`
      break
    case `No such user`:
      title = `This user does not exist. It may have been deleted.`
      subtitle = `Try a different userId?`
      break
    case `No such recipe`:
      title = `This recipe does not exist. It may have been deleted.`
      subtitle = `Try a different recipe?`
      break
    default:
      title = `Something went wrong.`
      subtitle = `sorry`
  }

  return (
    <Card>
      <h2 className={sg.textCenter}>{title}</h2>
      <h3 className={sg.textCenter}>{subtitle}</h3>
    </Card>
  )
}
