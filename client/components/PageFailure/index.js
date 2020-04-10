import React from 'react'

import ss from '../../index.css'

const pageFailure = ({ type }) => {
  let title = ``
  let subtitle = ``
  switch (type) {
    case `404`:
      title = `404 Page Not Found:`
      subtitle = `Oh no, there's nothing here!`
      break
    case `401`:
      title = `401 Unauthorized:`
      subtitle = `You must log in to see this!`
      break
    default:
      console.log(`unrecognized page failure`)
  }

  return (
    <div className={ss.centerContainer}>
      <h1 className={ss.centerText}>{title}</h1>
      <h2 className={ss.centerText}>{subtitle}</h2>
    </div>
  )
}


export default pageFailure
