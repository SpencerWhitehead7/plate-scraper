import buildAsyncHandler from './asyncHandlerBuilder'

import { API } from 'consts'

const asyncFnToHandle = async ({ email, password, userName, newEmail, newPassword, newUserName, isLogout, isDestroy } = {}) => {
  let data
  if (email && userName && password) {
    ({ data } = await API.auth.signup(email, userName, password))
  } else if (email && password) {
    ({ data } = await API.auth.login(email, password))
  } else if (password && (newEmail || newUserName || newPassword)) {
    ({ data } = await API.auth.editMe(password, newEmail, newUserName, newPassword))
  } else if (!isLogout && !isDestroy) {
    ({ data } = await API.auth.getMe())
  }

  if (isLogout) {
    await API.auth.logout()
    return null
  }

  if (isDestroy && password) {
    await API.auth.deleteMe(password)
    return null
  }

  return data
}

export const name = `auth`

export default buildAsyncHandler(name, asyncFnToHandle)
