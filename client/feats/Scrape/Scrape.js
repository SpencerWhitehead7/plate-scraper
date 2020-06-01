import React from 'react'

import Card from 'comps/Card'
import RecipeForm from './RecipeForm'
import SupportedSites from './SupportedSites'
import UrlForm from './UrlForm'

const Scrape = () => (
  <Card>
    <SupportedSites />
    <UrlForm />
    <RecipeForm />
  </Card>
)

export default Scrape
