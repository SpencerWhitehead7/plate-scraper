import React from 'react'

import Card from 'comps/Card'

import sg from 'styles/index.scss'

const pageFailure = ({ type }) => {
  let title = ``
  let subtitle = ``
  switch (type) {
    case `404`:
      title = `404 Page Not Found`
      subtitle = `Oh no, there's nothing here!`
      break
    case `401`:
      title = `401 Unauthorized`
      subtitle = `You must log in to see this!`
      break
    case `No such user`:
      title = `This user does not exist`
      subtitle = `Try a different userId`
      break
    case `No such recipe`:
      title = `This recipe does not exist`
      subtitle = `Try a different recipe`
      break
    default:
      console.log(`unrecognized page failure`)
  }

  return (
    <Card>
      <h2 className={sg.textCenter}>{title}</h2>
      <h3 className={sg.textCenter}>{subtitle}</h3>
    </Card>
  )
}


export default pageFailure
