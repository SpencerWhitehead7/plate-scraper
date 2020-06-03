import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async url => {
  const { data } = await API.scrape(url)

  return data
}

export const name = `scrape`

export default buildAsyncHandler(name, asyncFnToHandle)
