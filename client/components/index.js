import React, { Component } from 'react'
import axios from 'axios'

class Main extends Component{
	constructor(){
		super()
		this.state = {
			url : ``,
			recipe : `AAA`,
		}
	}

  handleChange = event => {
  	this.setState({
  		[event.target.name] : event.target.value,
  	})
  }

  handleSubmit = event => {
  	event.preventDefault()
  	console.log(event.target)
  	// axios??? some command to backend to make it run the script
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
  				this.state.recipe === ``
  					? <div/>
  					: <textarea>
  						  {this.state.recipe}
  					  </textarea>
  			}
  		</div>
  	)
  }
}

export default Main