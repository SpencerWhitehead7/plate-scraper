import React from 'react'

const Warning = props => {
  const {error} = props
  return (
    <span className="warning">
      {error}
    </span>
  )
}

export default Warning
