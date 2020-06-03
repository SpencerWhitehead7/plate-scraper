import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async (recipeId, text, title, tags) => {
  let data
  if (recipeId && text && title && tags) {
    ({ data } = await API.recipe.edit(recipeId, text, title, tags))
  } else {
    ({ data } = await API.recipe.get(recipeId))
  }

  return data
}

export const name = `recipe`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
