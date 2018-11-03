import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import Main from './components'

import WebFont from 'webfontloader'

WebFont.load({
  google : {
    families : [`Open Sans`],
  },
})

ReactDOM.render(
  <Main/>,
  document.getElementById(`root`)
)
