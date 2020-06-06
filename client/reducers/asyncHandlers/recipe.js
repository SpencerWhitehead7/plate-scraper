import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async (recipeId, { text, title, sourceSite, sourceUrl, tags, isDelete } = {}) => {
  let data
  if (recipeId && text && title && sourceSite && sourceUrl && tags) {
    ({ data } = await API.recipe.create(text, title, sourceSite, sourceUrl, tags))
  } else if (recipeId && text && title && tags) {
    ({ data } = await API.recipe.edit(recipeId, text, title, tags))
  } else if (isDelete) {
    await API.recipe.destroy(recipeId)
    return null
  } else {
    ({ data } = await API.recipe.get(recipeId))
  }

  return data
}

export const name = `recipe`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
