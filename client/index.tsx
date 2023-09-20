import "core-js/stable"
import "regenerator-runtime/runtime"
import "styles/index.scss"
import "normalize.css"
import "skeleton.css"

import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

// using @/ and ./ to make sure store is imported above App, which prevents a circular dependency...
// this is incredibly insane, but it works and appears to be necessary
import { store } from "@/reducers"

import { App } from "./App"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
