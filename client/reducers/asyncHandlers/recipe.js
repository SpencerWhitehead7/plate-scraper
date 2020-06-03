import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async recipeId => {
  const { data } = await API.recipe.get(recipeId)

  return data
}

export const name = `recipe`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
