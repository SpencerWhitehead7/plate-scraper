import "normalize.css"
import "./skeleton.module.css"
import "./styles/index.module.scss"

import { createRouter, RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import { store } from "./reducers"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree,
  search: { strict: true },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)

// TODO data missing page failure/404 handled tanstack style
// tanstack query for the backend, remove redux
// tanstack query integrated into the router's load functions
// refac of the scrape form, other react stuff, suspense instead of isLoading checks?

// fix the parsers lmao, update the deps, rebuild the chrome ext, update the deps, maybe update the fucking manifest if I need that to publish...
