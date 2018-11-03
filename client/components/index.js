import React from 'react'
import axios from 'axios'

import RecipeArea from './RecipeArea'
import SupportedSites from './SupportedSites'
import UrlForm from './UrlForm'
import Warning from './Warning'

class Main extends React.Component{
  constructor(){
    super()
    this.state = {
      url : ``,
      sourceSite : ``,
      sourceUrl : ``,
      title : ``,
      recipe : ``,
      error : {},
      isLoading : false,
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({
      sourceSite : ``,
      sourceUrl : ``,
      title : ``,
      recipe : ``,
      error : {},
      isLoading : true,
    }, async () => {
      try{
        const {data} = await axios.post(`/api`, {url : this.state.url})
        if(!data.recipe ||
        !data.recipe.includes(`•`) ||
        !data.recipe.includes(`1)`)){
          this.setState({
            error : {message : `Failed to scrape; make sure you're using a valid recipe URL`},
            isLoading : false,
          })
        }else{
          this.setState({
            sourceSite : data.sourceSite,
            sourceUrl : data.sourceUrl,
            title : data.title,
            recipe : data.recipe,
            error : {},
            isLoading : false,
          })
        }
      }catch(err){
        console.log(err)
        this.setState({
          error : err,
          isLoading : false,
        })
      }
    })
  }

  render(){
    return (
      <div id="whole-page">
        <h1 id="title">Plate Scraper!</h1>
        <SupportedSites/>
        <UrlForm
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          url={this.state.url}
        />
        {this.state.isLoading && <div className="loading"/>}
        {
          this.state.recipe !== `` &&
            <RecipeArea
              handleChange={this.handleChange}
              recipe={this.state.recipe}
              title={this.state.title}
              sourceSite={this.state.sourceSite}
            />
        }
        {Object.keys(this.state.error).length > 0 && <Warning error={this.state.error.message}/>}
      </div>
    )
  }
}

export default Main
