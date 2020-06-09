import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async tags => {
  const { data } = await API.recipe.getByTag(tags)

  return data
}

export const name = `search`

export default buildAsyncHandler(name, asyncFnToHandle)
