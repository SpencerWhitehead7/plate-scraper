import React, { Component } from 'react'
import axios from 'axios'

class Main extends Component{
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
  				<label htmlFor="url">url to scrape</label>
  				<input type="text" name="url" value={this.state.url}/>
  				<button
  					type="submit"
  					disabled={false} // add conditionals for if scraping the site would fail (ie, not supported)
  				>
          Scrape!
  				</button>
  			</form>
  			{
  				this.state.recipeText === ``
  					? <div/>
  					: <textarea name="recipe" onChange={this.handleChange} value={this.state.recipe}/>
  			}
  		</div>
  	)
  }
}

export default Main