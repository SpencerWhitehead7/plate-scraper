import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query/react"

import { modalReducer } from "@/comps/Modal"

export const store = configureStore({
  reducer: {
    modalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
