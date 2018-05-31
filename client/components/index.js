import React from 'react'
import Textarea from 'react-textarea-autosize'
import axios from 'axios'

import SupportedSites from './SupportedSites'
import SubmitButton from './SubmitButton'

class Main extends React.Component{
	constructor(){
		super()
		this.state = {
			url : ``,
			recipe : ``,
		}
	}

handleChange = event => {
	this.setState({
		[event.target.name] : event.target.value,
	})
}

  handleSubmit = event => {
  	event.preventDefault()
  	axios.post(`/api`, {url : this.state.url})
  	.then(recipe => {
  		this.setState({
  			recipe : recipe.data,
  		})
  	})
  		.catch(error => console.log(error))
  }

  render(){
  	return (
  		<div>
  			<SupportedSites/>
  			<form onChange={this.handleChange} onSubmit={this.handleSubmit} id="input">
  				<label htmlFor="url">
            recipe url:
  					{
  						(this.state.url.includes(`seriouseats.com`) && !this.state.url.includes(`seriouseats.com/recipes`))
  							? (<span id="se-warning">{`SeriousEats recipes must be at seriouseats.com/recipes, not seriouseats.com`} </span>)
  							: (<span/>)
  					}
  				</label>
  				<input
  					type="text"
  					name="url"
  					value={this.state.url}
  				/>
  				<SubmitButton url={this.state.url}/>
  			</form>
  			{
  				this.state.recipe === ``
  					? <div/>
  					: <Textarea
  						name="recipe"
  						onChange={this.handleChange}
  						value={this.state.recipe}
  						id="recipe-textarea"
  					/>
  			}
  		</div>
  	)
  }
}

export default Main