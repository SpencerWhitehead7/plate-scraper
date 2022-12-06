import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import qs from 'qs'
import { Params } from 'react-router-dom'

const parseRouteFields = (
  fields: Params<string> | string
): Record<string, string | number> => {
  const routeFieldsObj =
    typeof fields === 'string' ? qs.parse(fields, { ignoreQueryPrefix: true }) : fields ?? {}

  return Object.entries(routeFieldsObj).reduce((params, [param, value]) => {
    // todo fix typecast
    if ((/^\d+$/).test(value as string)) { // assuming any numeric route param will be an integer
      params[param] = Number(value)
    } else {
      params[param] = value
    }
    return params
  }, {})
}

type RouteState = {
  params: Record<string, string | number>,
  query: Record<string, string | number>,
}

const initialState: RouteState = {
  params: {},
  query: {},
}

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRouteData: (state, { payload }: PayloadAction<{ params: Params<string>, query: string }>) => {
      state.params = parseRouteFields(payload.params)
      state.query = parseRouteFields(payload.query)
    }
  }
})

export const { setRouteData } = routeSlice.actions
export const routeReducer = routeSlice.reducer
