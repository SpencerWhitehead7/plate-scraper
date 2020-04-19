import axios from "axios"
import buildAsyncHandler from './asyncHandlerBuilder'

const asyncFnToHandle = async id => {
  const { data } = await axios.get(`/api/recipe/byid/${id}`)

  return data
}

export const name = `recipe`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
