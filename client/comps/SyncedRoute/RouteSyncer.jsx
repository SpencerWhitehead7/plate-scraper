import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { setRouteData } from './routeReducer'

// TODO: keep experimenting with this to make it bulletproof, ensure it gets all route state necessary, and make sure it handles being nested anywhere
const SyncRoute = ({ children }) => {
  const dispatch = useDispatch()

  const params = useParams()
  const location = useLocation()

  const [currLocation, setCurrLocation] = useState({})

  useEffect(() => {
    if (
      (location.hash !== currLocation.hash ||
        location.pathname !== currLocation.pathname ||
        location.search !== currLocation.search) &&
      location.pathname === window.location.pathname
    ) {
      setCurrLocation(location)
      dispatch(setRouteData(params, location.search))
    }
  }, [location, currLocation, params, dispatch])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default SyncRoute
