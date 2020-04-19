import { INIT, SUCCESS, FAILURE } from './asyncHandlerBuilder'
import { name as authName } from './auth'
import { name as recipeName } from './recipe'
import { name as scrapeName } from './scrape'
import { name as userName } from './user'

const initialState = [
  authName,
  recipeName,
  scrapeName,
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
            ...state[name].loading,
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
            ...state[name].loaded,
            [key]: true,
          },
          isLoading: {
            ...state[name].loading,
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
    default:
      return state
  }
}

export default reducer
