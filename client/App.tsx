import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import s from "./App.scss"
import { Modal } from "./comps/Modal"
import { PATH } from "./consts"
import { Account } from "./feats/Account"
import { Navbar } from "./feats/Navbar"
import { PageFailure } from "./feats/PageFailure"
import { Recipe } from "./feats/Recipe"
import { Scrape } from "./feats/Scrape"
import { Search } from "./feats/Search"
import { Upload } from "./feats/Upload"

export const App = () => (
  <BrowserRouter>
    <Navbar />
    <main className={s.main}>
      <div className={s.content}>
        <Routes>
          <Route path={PATH.base} element={<Scrape />} />
          <Route path={PATH.scrape} element={<Scrape />} />
          <Route path={PATH.upload} element={<Upload />} />
          <Route path={PATH.user} element={<Account />} />
          <Route path={PATH.recipe} element={<Recipe />} />
          <Route path={PATH.search} element={<Search />} />
          <Route path="*" element={<PageFailure />} />
        </Routes>
      </div>
    </main>
    <Modal />
  </BrowserRouter>
)
