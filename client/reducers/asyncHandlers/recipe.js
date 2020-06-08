import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async (recipeId, { text, title, sourceSite, sourceUrl, tags, url, isDelete } = {}) => {
  let data
  if (recipeId && text && title && sourceSite && sourceUrl && tags) {
    ({ data } = await API.recipe.create(text, title, sourceSite, sourceUrl, tags))
  } else if (url) {
    ({ data } = await API.scrape(url))
  } else if (recipeId && text && title && tags) {
    ({ data } = await API.recipe.edit(recipeId, text, title, tags))
  } else if (isDelete) {
    ({ data } = await API.recipe.destroy(recipeId))
  } else {
    ({ data } = await API.recipe.get(recipeId))
  }

  return data
}

export const name = `recipe`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
