import React, { useEffect, useState } from 'react'
import { useLocation, useParams, Location } from 'react-router-dom'

import { useAppDispatch } from '@/reducers'

import { setRouteData } from './routeReducer'

// TODO: keep experimenting with this to make it bulletproof, ensure it gets all route state necessary, and make sure it handles being nested anywhere
export const SyncRoute = ({ children }) => {
  const dispatch = useAppDispatch()

  const params = useParams()
  const location = useLocation()

  const [currLocation, setCurrLocation] = useState({} as Location)

  useEffect(() => {
    if (
      (location.hash !== currLocation.hash ||
        location.pathname !== currLocation.pathname ||
        location.search !== currLocation.search) &&
      location.pathname === window.location.pathname
    ) {
      setCurrLocation(location)
      dispatch(setRouteData({ params, query: location.search }))
    }
  }, [location, currLocation, params, dispatch])

  return <>{children}</>
}
