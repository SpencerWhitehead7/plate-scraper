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
			error : false,
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
  		if(!recipe.data.includes(`•`) || !recipe.data.includes(`1)`)){
  			this.setState({
  				error : true,
  				recipe : ``,
  			})
  		}else{
  		  this.setState({
  			  url : ``,
  				recipe : recipe.data,
  				error : false,
  			})
  		}
  	})
  		.catch(error => console.log(error))
  }

  render(){
  	return (
  		<div id="whole-page">
  			<h1 id="title">Plate Scraper!</h1>
  			<SupportedSites/>
  					<form onChange={this.handleChange} onSubmit={this.handleSubmit} id="input-form">
  					<label htmlFor="url">
            Paste in a recipe url from a supported site and Scrape!<br/>
  						{
  						  (this.state.url.includes(`seriouseats.com`) && !this.state.url.includes(`seriouseats.com/recipes`))
  								? <span className="warning">{`Make sure your url is from seriouseats.com/recipes, not just seriouseats.com`}</span>
  								: <span/>
  						}
  					</label>
  				<div id="input-button-container">
  					<input
  							type="text"
  							name="url"
  							placeholder="url to scrape: for example, https://www.allrecipes.com/recipe/22918/pop-cake/"
  							value={this.state.url}
  							id="input"
  					/>
  						<SubmitButton url={this.state.url}/>
  				</div>
  					</form>
  			<div id="textarea-error-container">
  				{
  					this.state.recipe === ``
  						? <div/>
  						:	<Textarea
  							name="recipe"
  							onChange={this.handleChange}
  							value={this.state.recipe}
  							id="recipe-textarea"
  						/>
  				}
  				{
  					this.state.error
  						? <div className="warning">
                  Error: failed to scrape: invalid url<br/>
                  Make sure you're using the url of a specific recipe
  						  </div>
  						: <div/>
  				}
  			</div>
  		</div>
  	)
  }
}

export default Main