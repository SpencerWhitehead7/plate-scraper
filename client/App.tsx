import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { PATH } from './consts'
import { Modal } from './comps/Modal'
import { Navbar } from './feats/Navbar'
import { Scrape } from './feats/Scrape'
import { Upload } from './feats/Upload'
import { Account } from './feats/Account'
import { Recipe } from './feats/Recipe'
import { Search } from './feats/Search'
import { PageFailure } from './feats/PageFailure'

import s from './App.scss'

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
