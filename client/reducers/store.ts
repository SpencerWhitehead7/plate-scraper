import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import { modalReducer } from '../comps/Modal'
import { routeReducer } from '../comps/SyncedRoute'

import { api } from './api'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    modalReducer,
    routeReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
  ]
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
