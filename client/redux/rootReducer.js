// import { combineReducers} from 'redux'
import axios from 'axios'

const initialState = {
  user : {},
  authError : {},
}

// Action types
const A = {
  GET : `GET_USER`,
  REMOVE : `REMOVE_USER`,
  AUTH_ERROR : `AUTH_ERROR`,
}

// Action creators
const getUser = user => ({type : A.GET, user})
const removeUser = () => ({type : A.REMOVE})
const authError = err => ({type : A.AUTH_ERROR, err})

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

export const signup = (email, userName, password) => async dispatch => {
  try{
    const {data} = await axios.post(`/auth/signup`, {email, userName, password})
    dispatch(getUser(data))
  }catch(err){
    dispatch(authError(err.response))
    console.log(err)
  }
}

export const login = (email, password) => async dispatch => {
  try{
    const {data} = await axios.post(`/auth/login`, {email, password})
    dispatch(getUser(data))
  }catch(err){
    dispatch(authError(err.response))
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
      return {...state, user : action.user, authError : {}}
    case A.REMOVE:
      return initialState
    case A.AUTH_ERROR:
      return {...state, authError : action.err}
    default:
      return state
  }
}

export default reducer
