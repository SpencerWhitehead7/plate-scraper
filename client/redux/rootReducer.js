// import { combineReducers} from 'redux'
import axios from 'axios'
import racf from 'redux-action-creator-factory'

const initialState = {}

// Action types
const A = {
  GET : `GET_USER`,
  REMOVE : `REMOVE_USER`,
}

// Action creators
const getUser = user => racf(A.GET, user)
const removeUser = () => racf(A.REMOVE)

// Thunk creators
export const me = () => async dispatch => {
  try{
    const {data} = await axios.get(`auth/me`)
    console.log(data)
    const user = data || initialState
    dispatch(getUser(user))
  }catch(err){
    console.log(err)
  }
}

export const auth = (email, password, method) => async dispach => {
  try{
    const {data} = await axios.post(`/auth/${method}`, {email, password})
    dispach(getUser(data))
  }catch(err){
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
      return action.user
    case A.REMOVE:
      return initialState
    default:
      return state
  }
}

export default reducer
