import React from 'react'

import sg from '../../styles/main.scss'

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
    default:
      console.log(`unrecognized page failure`)
  }

  return (
    <div>
      <h2 className={sg.textCenter}>{title}</h2>
      <h3 className={sg.textCenter}>{subtitle}</h3>
    </div>
  )
}


export default pageFailure
