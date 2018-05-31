import React from 'react'
import Textarea from 'react-textarea-autosize'
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

  /* eslint-disable complexity */ // the button, man
  render(){
  	return (
  		<div>
  			<div id="supported-area">
  				<h3 id="supported-field"> Supported Sites: </h3>
  				<br/>
            allrecipes.com
            bettycrocker
            bonappetit
            chowhound
            cookinglight
  				<br/>
            eatingwell
            epicurious.com
            food52
            foodandwine
            foodnetwork
            geniuskitchen
  				<br/>
            jamieoliver
            myrecipes
            thekitchn.com
            simplyrecipes
            seriouseats.com/recipes
  			</div>
  			<form onChange={this.handleChange} onSubmit={this.handleSubmit} id="input">
  				<label htmlFor="url">
            recipe url:
  				</label>
  				<input
  					type="text"
  					name="url"
  					value={this.state.url}
  				/>
  				<button
  					type="submit"
  					disabled={
  						!this.state.url.includes(`allrecipes.com`) &&
  						!this.state.url.includes(`bettycrocker`) &&
              !this.state.url.includes(`bonappetit`) &&
              !this.state.url.includes(`chowhound`) &&
              !this.state.url.includes(`cookinglight`) &&
              !this.state.url.includes(`eatingwell`) &&
  						!this.state.url.includes(`epicurious.com`) &&
              !this.state.url.includes(`food52`) &&
              !this.state.url.includes(`foodandwine`) &&
              !this.state.url.includes(`foodnetwork`) &&
              !this.state.url.includes(`geniuskitchen`) &&
              !this.state.url.includes(`jamieoliver`) &&
              !this.state.url.includes(`myrecipes`) &&
  						!this.state.url.includes(`seriouseats.com/recipes`) &&
              !this.state.url.includes(`simplyrecipes`) &&
              !this.state.url.includes(`thekitchn.com`)
  					}
  					id="btn-sub"
  				>
          Scrape!
  				</button>
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
  	/* eslint-enable complexity */
  }
}

export default Main