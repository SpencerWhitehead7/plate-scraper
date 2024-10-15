import React from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import s from "./App.module.scss"
import { Modal } from "./comps/Modal"
import { PATH } from "./consts"
import { Account } from "./feats/Account"
import { Home } from "./feats/Home"
import { Navbar } from "./feats/Navbar"
import { PageFailure } from "./feats/PageFailure"
import { Recipe } from "./feats/Recipe"
import { RecipesAll } from "./feats/RecipesAll"
import { UsersAll } from "./feats/UsersAll"

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
            element: <Home />,
          },
          {
            path: PATH.usersAll,
            element: <UsersAll />,
          },
          {
            path: PATH.user,
            element: <Account />,
          },
          {
            path: PATH.recipesAll,
            element: <RecipesAll />,
          },
          {
            path: PATH.recipe,
            element: <Recipe />,
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
