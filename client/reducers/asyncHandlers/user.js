import axios from "axios"
import buildAsyncHandler from './asyncHandlerBuilder'

const asyncFnToHandle = async id => {
  const { data } = await axios.get(`/api/user/${id}`)

  return data
}

export const name = `user`

export default buildAsyncHandler(name, asyncFnToHandle, [0])
