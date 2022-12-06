import { configureStore } from '@reduxjs/toolkit'

import { modalReducer } from '../comps/Modal'
import { routeReducer } from '../comps/SyncedRoute'

// import asyncHandlerReducer from './asyncHandlers'

export const store = configureStore({
  reducer: {
    // asyncHandlerReducer,
    modalReducer,
    routeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
