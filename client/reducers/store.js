import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { modalReducer } from 'comps/Modal'
import { routeReducer } from 'comps/SyncedRoute'
import asyncHandlerReducer from './asyncHandlers'

const rootReducer = combineReducers({
  asyncHandler: asyncHandlerReducer,
  modal: modalReducer,
  route: routeReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = createLogger({
  collapsed: true,
})

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    logger,
  )),
)

export default store
