import React from 'react'

const Warning = props => {
  const {err} = props
  return (
    <span className="warning">
      {err}
    </span>
  )
}

export default Warning
