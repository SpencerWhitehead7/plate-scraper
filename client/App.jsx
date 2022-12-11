import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { PATH } from 'consts'
import { Modal } from './comps/Modal'
import { SyncRoute } from './comps/SyncedRoute'
import { Navbar } from './feats/Navbar'
import Scrape from 'feats/Scrape'
import Upload from 'feats/Upload'
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
          {/* <Route path={PATH.base} element={<SyncRoute><Scrape /></SyncRoute>} />
          <Route path={PATH.scrape} element={<SyncRoute><Scrape /></SyncRoute>} />
          <Route path={PATH.upload} element={<SyncRoute><Upload /></SyncRoute>} />
        */}
          <Route path={PATH.user} element={<SyncRoute><Account /></SyncRoute>} />
          <Route path={PATH.recipe} element={<SyncRoute><Recipe /></SyncRoute>} />
          <Route path={PATH.search} element={<SyncRoute><Search /></SyncRoute>} />
          <Route path="*" element={<SyncRoute><PageFailure /></SyncRoute>} />
        </Routes>
      </div>
    </main>
    <Modal />
  </BrowserRouter>
)
