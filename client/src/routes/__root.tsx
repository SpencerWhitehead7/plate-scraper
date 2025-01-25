import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import React from "react"

import { queryClient } from "@/api"
import { Modal } from "@/comps/Modal"
import { ProviderModal } from "@/comps/Modal"
import { Navbar } from "@/comps/Navbar"
import { PageFailure } from "@/comps/PageFailure"

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
  <QueryClientProvider client={queryClient}>
    <ProviderModal>
      <Navbar />
      <main className={s.main}>
        <div className={s.content}>
          <Outlet />
        </div>
      </main>
      <Modal />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </ProviderModal>
  </QueryClientProvider>
)

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <PageFailure type="404" />,
})
