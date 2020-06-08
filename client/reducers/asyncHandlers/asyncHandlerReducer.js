import { INIT, SUCCESS, FAILURE, CLEAR } from './asyncHandlerBuilder'
import { name as authName } from './auth'
import { name as recipeName } from './recipe'
import { name as userName } from './user'

const initialState = [
  authName,
  recipeName,
  userName,
].reduce((state, name) => {
  state[name] = {
    data: {},
    error: {},
    isLoaded: {},
    isLoading: {},
  }
  return state
}, {})

const reducer = (state = initialState, { type, name, key, data, error }) => {
  switch (type.split(`-`)[0]) {
    case INIT:
      return {
        ...state,
        [name]: {
          ...state[name],
          error: {
            ...state[name].error,
            [key]: null,
          },
          isLoading: {
            ...state[name].isLoading,
            [key]: true,
          },
        },
      }
    case SUCCESS:
      return {
        ...state,
        [name]: {
          ...state[name],
          data: {
            ...state[name].data,
            [key]: data,
          },
          error: {
            ...state[name].error,
            [key]: null,
          },
          isLoaded: {
            ...state[name].isLoaded,
            [key]: true,
          },
          isLoading: {
            ...state[name].isLoading,
            [key]: false,
          },
        },
      }
    case FAILURE:
      return {
        ...state,
        [name]: {
          ...state[name],
          data: {
            ...state[name].data,
            [key]: null,
          },
          error: {
            ...state[name].error,
            [key]: error,
          },
          isLoaded: {
            ...state[name].isLoaded,
            [key]: false,
          },
          isLoading: {
            ...state[name].isLoading,
            [key]: false,
          },
        },
      }
    case CLEAR:
      return {
        ...state,
        [name]: {
          ...state[name],
          data: {
            ...state[name].data,
            [key]: undefined,
          } || {},
          error: {
            ...state[name].error,
            [key]: undefined,
          } || {},
          isLoaded: {
            ...state[name].isLoaded,
            [key]: undefined,
          } || {},
          isLoading: {
            ...state[name].isLoading,
            [key]: undefined,
          } || {},
          // || {} to ensure shape if the only field in the handler is the one being cleared
        },
      }
    default:
      return state
  }
}

export default reducer
