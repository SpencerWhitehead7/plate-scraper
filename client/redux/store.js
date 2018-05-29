import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import axios from 'axios'
import reducer from './rootReducer'

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	applyMiddleware(
		thunkMiddleware.withExtraArgument({axios}),
		createLogger()
	)
)

export default store