/* eslint-disable react/no-unused-state */
import React from 'react'
import axios from 'axios'

import AutosizingTextarea from 'comps/AutosizingTextarea'
import Card from 'comps/Card'
import LoadingIndicator from 'comps/LoadingIndicator'
import DownloadForm from './DownloadForm'
import SupportedSites from './SupportedSites'
import UrlForm from './UrlForm'
import Warning from './Warning'

class Scrape extends React.Component {
  constructor() {
    super()
    this.state = {
      url: ``,
      sourceSite: ``,
      sourceUrl: ``,
      title: ``,
      recipe: ``,
      err: {},
      isLoading: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      sourceSite: ``,
      sourceUrl: ``,
      title: ``,
      recipe: ``,
      err: {},
      isLoading: true,
    }, async () => {
      try {
        const { data } = await axios.post(`/api/scrape`, { url: this.state.url })
        console.log(data)
        if (data.message && data.name &&
          !data.sourceSite && !data.sourceUrl && !data.title && !data.recipe) { // duck typing to check for errors
          this.setState({ err: data, isLoading: false })
        } else {
          this.setState({
            sourceSite: data.sourceSite,
            sourceUrl: data.sourceUrl,
            title: data.title,
            recipe: data.recipe,
            err: {},
            isLoading: false,
          })
        }
      } catch (err) {
        console.log(err)
        this.setState({
          err,
          isLoading: false,
        })
      }
    })
  }

  render() {
    return (
      <Card>
        <SupportedSites />
        <UrlForm
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          url={this.state.url}
        />
        {this.state.isLoading && <LoadingIndicator />}
        {
          this.state.recipe && (
            <>
              <AutosizingTextarea
                name="recipe"
                value={this.state.recipe}
                onChange={this.handleChange}
              />
              <DownloadForm
                title={this.state.title}
                sourceSite={this.state.sourceSite}
                recipe={this.state.recipe}
              />
            </>
          )
        }
        {Object.keys(this.state.err).length > 0 && <Warning err={this.state.err.message} />}
      </Card>
    )
  }
}

export default Scrape
