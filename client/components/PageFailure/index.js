import React from 'react'

import ss from '../../index.css'

const pageFailure = props => {
  let title = ``
  let subtitle = ``
  switch(props.type){
    case `404`:
      title = `404 Page Not Found:`
      subtitle = `Oh no, there's nothing here!`
      break
    case `501`:
      title = `501 Unauthorized:`
      subtitle = `You must log in to see this!`
      break
    default:
      console.log(`unrecognized page failure`)
  }

  return (
    <div className={ss.centerContainer}>
      <h1 className={ss.centerText}>
        {title}
        <br/>
        {subtitle}
      </h1>
    </div>
  )
}


export default pageFailure
