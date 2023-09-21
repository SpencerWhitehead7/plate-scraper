import React from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import s from "./App.module.scss"
import { Modal } from "./comps/Modal"
import { PATH } from "./consts"
import { Account } from "./feats/Account"
import { Navbar } from "./feats/Navbar"
import { PageFailure } from "./feats/PageFailure"
import { Recipe } from "./feats/Recipe"
import { Scrape } from "./feats/Scrape"
import { Search } from "./feats/Search"
import { Upload } from "./feats/Upload"

const router = createBrowserRouter([
  {
    path: PATH.base,
    element: (
      <>
        <Navbar />
        <main className={s.main}>
          <div className={s.content}>
            <Outlet />
          </div>
        </main>
        <Modal />
      </>
    ),
    errorElement: <PageFailure />,
    children: [
      {
        errorElement: <PageFailure />,
        children: [
          {
            index: true,
            element: <Scrape />,
          },
          {
            path: PATH.scrape,
            element: <Scrape />,
          },
          {
            path: PATH.upload,
            element: <Upload />,
          },
          {
            path: PATH.user,
            element: <Account />,
          },
          {
            path: PATH.recipe,
            element: <Recipe />,
          },
          {
            path: PATH.search,
            element: <Search />,
          },
          {
            path: "*",
            element: <PageFailure type="404" />,
          },
        ],
      },
    ],
  },
])

export const App: React.FC = () => <RouterProvider router={router} />
