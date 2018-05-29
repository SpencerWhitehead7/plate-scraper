import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.render(
	<Provider store={store}>
		<div>boilerplate</div>
	</Provider>,
	document.getElementById(`root`)
)