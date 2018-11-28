// import { combineReducers} from 'redux'
import axios from 'axios'
import racf from 'redux-action-creator-factory'

const initialState = {}

// Action types
const A = {
  GET : `GET_USER`,
}

// Action creators
const getUser = user => racf(A.GET, user)

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

// const reducer = combineReducers({}}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case A.GET:
      return action.user
    default:
      return state
  }
}

export default reducer
