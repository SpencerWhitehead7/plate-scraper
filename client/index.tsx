import "core-js/stable"
import "regenerator-runtime/runtime"

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'normalize.css'

import { store } from './reducers'
import { App } from './App'

import 'skeleton.css'
import 'styles/index.scss'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
