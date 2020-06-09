import { searchAsyncHandler } from 'reducers/asyncHandlers'

export const selectSearch = state => searchAsyncHandler.select(state)
