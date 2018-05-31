import React from 'react'
import axios from 'axios'

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
  			<form onChange={this.handleChange} onSubmit={this.handleSubmit}>
  				<label htmlFor="url">recipe url:</label>
  				<input type="text" name="url" value={this.state.url}/>
  				<button
  					type="submit"
  					disabled={false
  						// !this.state.url.includes(`seriouseats.com/recipes`) &&
  						// !this.state.url.includes(`allrecipes.com`) &&
  						// !this.state.url.includes(`epicurious.com`) &&
  						// !this.state.url.includes(`thekitchn.com`)
  					} // add conditionals to check if site is supported
  				>
          Scrape!
  				</button>
  			</form>
  			{
  				this.state.recipe === ``
  					? <div/>
  					: <textarea name="recipe" onChange={this.handleChange} value={this.state.recipe}/>
  			}
  		</div>
  	)
  }
}

export default Main