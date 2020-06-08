import { recipeAsyncHandler } from 'reducers/asyncHandlers'

export const selectScrape = state => recipeAsyncHandler.select(state, `scrape`)
