import React from 'react'
import { connect } from 'react-redux'

import Card from 'comps/Card'
import { RecipeForm, Warning } from 'comps/Form'
import LoadingIndicator from 'comps/LoadingIndicator'
import { selectScrape } from './selectors'
import SupportedSites from './SupportedSites'
import UrlForm from './UrlForm'

const Scrape = ({ data: recipe, isLoading, error }) => (
  <Card>
    <SupportedSites />
    <UrlForm />
    {isLoading
      ? <LoadingIndicator />
      : recipe
        ? <RecipeForm recipe={recipe} />
        : <Warning leftPadded={false} customError={error} />}
  </Card>
)

const mstp = state => ({
  ...selectScrape(state),
})

export default connect(mstp, null)(Scrape)
