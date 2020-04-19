import axios from "axios"
import buildAsyncHandler from './asyncHandlerBuilder'

const asyncFnToHandle = async ({ email, password, userName, isLogout } = {}) => {
  let data
  if (email && userName && password) {
    ({ data } = await axios.post(`/auth/signup`, { email, userName, password }))
  } else if (email && password) {
    ({ data } = await axios.post(`/auth/login`, { email, password }))
  } else if (!isLogout) {
    ({ data } = await axios.get(`/auth/me`))
  }

  if (isLogout) {
    await axios.post(`/auth/logout`)
    return null
  }

  return data
}

export const name = `auth`

export default buildAsyncHandler(name, asyncFnToHandle)
