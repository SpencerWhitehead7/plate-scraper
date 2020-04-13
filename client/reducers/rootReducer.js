import { combineReducers } from 'redux'

import authReducer from './authReducer'
import { modalReducer } from 'comps/Modal'

const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
})

export default rootReducer
