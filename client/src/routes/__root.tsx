import { createRootRoute, Outlet } from "@tanstack/react-router"
import React from "react"

import { Modal } from "@/comps/Modal"
import { Navbar } from "@/feats/Navbar"
import { PageFailure } from "@/feats/PageFailure"

import s from "./__root.module.scss"

// only include in dev
const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

const RootComponent = () => (
  <>
    <Navbar />
    <main className={s.main}>
      <div className={s.content}>
        <Outlet />
      </div>
    </main>
    <Modal />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <PageFailure type="404" />,
})
