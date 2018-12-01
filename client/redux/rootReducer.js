// import { combineReducers} from 'redux'
import axios from 'axios'

const initialState = {
  user : {},
  loginError : {},
}

// Action types
const A = {
  GET : `GET_USER`,
  REMOVE : `REMOVE_USER`,
  LOGIN_ERROR : `LOGIN_ERROR`,
}

// Action creators
const getUser = user => ({type : A.GET, user})
const removeUser = () => ({type : A.REMOVE})
const loginError = err => ({type : A.LOGIN_ERROR, err})

// Thunk creators
export const me = () => async dispatch => {
  try{
    const {data} = await axios.get(`auth/me`)
    const user = data || initialState
    dispatch(getUser(user))
  }catch(err){
    console.log(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  try{
    const {data} = await axios.post(`/auth/${method}`, {email, password})
    dispatch(getUser(data))
  }catch(err){
    dispatch(loginError(err.response))
    console.log(err)
  }
}

export const logout = () => async dispatch => {
  try{
    await axios.post(`/auth/logout`)
    dispatch(removeUser())
  }catch(err){
    console.log(err)
  }
}

// const reducer = combineReducers({}}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case A.GET:
      return {...state, user : action.user, loginError : {}}
    case A.REMOVE:
      return initialState
    case A.LOGIN_ERROR:
      return {...state, loginError : action.err}
    default:
      return state
  }
}

export default reducer
