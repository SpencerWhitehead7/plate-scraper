import store from '..'

export const INIT = `asyncTracker/INIT`
export const SUCCESS = `asyncTracker/SUCCESS`
export const FAILURE = `asyncTracker/FAILURE`

const init = (name, key) => ({ type: `${INIT}-${name}-${key}`, name, key })
const success = (name, key, data) => ({ type: `${SUCCESS}-${name}-${key}`, name, key, data })
const failure = (name, key, error) => ({ type: `${FAILURE}-${name}-${key}`, name, key, error })

const callAsync = (name, asyncFunction, getKey, ...restParams) => async dispatch => {
  const key = getKey(...restParams)

  try {
    dispatch(init(name, key))
    const res = await asyncFunction(...restParams)
    dispatch(success(name, key, res))
  } catch (error) {
    dispatch(failure(name, key, error.toString()))
  }
}

const selectAsync = (name, getKey, state, ...restParams) => {
  const key = getKey(...restParams)
  const getOrDefault = (field, defaultValue) => (field === undefined ? defaultValue : field)

  return {
    data: getOrDefault(state.asyncHandler[name].data[key], null),
    error: getOrDefault(state.asyncHandler[name].error[key], null),
    isLoaded: getOrDefault(state.asyncHandler[name].isLoaded[key], false),
    isLoading: getOrDefault(state.asyncHandler[name].isLoading[key], false),
  }
}

const callIfNeededAsync = (name, asyncFunction, getKey, ...restParams) => dispatch => {
  const state = store.getState()
  const { isLoaded, data } = selectAsync(name, getKey, state, ...restParams)
  if (isLoaded) {
    return data
  } else {
    return dispatch(callAsync(name, asyncFunction, getKey, ...restParams))
  }
}

const buildAsyncHandler = (name, asyncFunction, generateGetKey = () => `default`) => {
  let getKey
  if (Array.isArray(generateGetKey)) {
    // if you pass an array for generateGetKey joins the arguments passed in at the specified indices
    getKey = (...restParams) => generateGetKey.map(index => restParams[index]).join(`_`)
  } else {
    // if you pass a function, it just uses that function
    getKey = generateGetKey
  }
  // undefined defaults to just using the key, well, `default`

  return {
    call: callAsync.bind(null, name, asyncFunction, getKey),
    callIfNeeded: callIfNeededAsync.bind(null, name, asyncFunction, getKey),
    select: selectAsync.bind(null, name, getKey),
  }
}

export default buildAsyncHandler
