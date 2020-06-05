import qs from 'qs'

const A = {
  SET_ROUTE_DATA: `app/SET_ROUTE_DATA`,
}

export const setRouteData = (params, query) => ({ type: A.SET_ROUTE_DATA, params, query })

const parseRouteFields = fields => {
  const routeFieldsObj =
    typeof fields === `string` ? qs.parse(fields, { ignoreQueryPrefix: true }) : fields

  return Object.entries(routeFieldsObj).reduce((params, [param, value]) => {
    if ((/^\d+$/).test(value)) { // assuming any numeric route param will be an integer
      params[param] = Number(value)
    } else {
      params[param] = value
    }
    return params
  }, {})
}

const initialState = {
  params: {},
  query: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case A.SET_ROUTE_DATA:
      return {
        ...state,
        params: parseRouteFields(action.params),
        query: parseRouteFields(action.query),
      }
    default:
      return state
  }
}
