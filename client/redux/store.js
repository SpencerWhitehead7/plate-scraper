import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducer from './rootReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = createLogger({
  collapsed : true,
})

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      logger,
    )
  )
)

export default store
