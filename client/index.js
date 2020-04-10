import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import Main from './feats'

import 'normalize.css'
import './skeleton.css'

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById(`root`),
)
