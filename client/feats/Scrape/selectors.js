import { scrapeAsyncHandler } from 'reducers/asyncHandlers'

export const selectScrape = state => scrapeAsyncHandler.select(state)
