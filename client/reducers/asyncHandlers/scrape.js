import axios from "axios"
import buildAsyncHandler from './asyncHandlerBuilder'

const asyncFnToHandle = async url => {
  const { data } = await axios.post(`/api/scrape`, { url })

  return data
}

export const name = `scrape`

export default buildAsyncHandler(name, asyncFnToHandle)
