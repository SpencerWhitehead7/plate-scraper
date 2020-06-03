import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async userId => {
  const { data } = await API.user(userId)

  return data
}

export const name = `user`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
