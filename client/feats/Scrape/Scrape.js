import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { scrapeAsyncHandler } from 'reducers/asyncHandlers'
import AutosizingTextarea from 'comps/AutosizingTextarea'
import Card from 'comps/Card'
import LoadingIndicator from 'comps/LoadingIndicator'
import DownloadForm from './DownloadForm'
import SupportedSites from './SupportedSites'
import UrlForm from './UrlForm'
import Warning from './Warning'

const Scrape = ({ error, isLoading, data: initialRecipe, scrape }) => {
  const [url, setUrl] = useState(``)
  const [recipe, setRecipe] = useState(initialRecipe)

  const handleChangeUrl = evt => {
    setUrl(evt.target.value)
  }
  const handleSubmit = evt => {
    evt.preventDefault()
    scrape(url)
  }

  useEffect(() => {
    setRecipe(initialRecipe)
  }, [initialRecipe])

  const handleChangeRecipeText = evt => {
    setRecipe({
      ...recipe,
      recipe: evt.target.value,
    })
  }

  return (
    <Card>
      <SupportedSites />
      <UrlForm
        handleChange={handleChangeUrl}
        handleSubmit={handleSubmit}
        url={url}
      />
      {isLoading && <LoadingIndicator />}
      {
        !isLoading && recipe && Object.entries(recipe).length && (
          <>
            <AutosizingTextarea
              name="recipe"
              value={recipe.recipe || ``}
              onChange={handleChangeRecipeText}
            />
            <DownloadForm {...recipe} />
          </>
        )
      }
      {error && <Warning error={error} />}
    </Card>
  )
}

const mstp = state => ({
  ...scrapeAsyncHandler.select(state),
})


const mdtp = dispatch => ({
  scrape: url => dispatch(scrapeAsyncHandler.call(url)),
})

export default connect(mstp, mdtp)(Scrape)
