import React from 'react'

import { Card } from '@/comps/Card'
import { RecipeForm, Warning } from '@/comps/Form'
import { LoadingIndicator } from '@/comps/LoadingIndicator'
import { useScrapeMutation } from '@/reducers'

import { SupportedSites } from './SupportedSites'
import { UrlForm } from './UrlForm'

export const Scrape = () => {
  const [triggerScrape, stateScrape] = useScrapeMutation()
  const { isLoading: isLoadingScrape, data: dataScrape, error: errorScrape } = stateScrape

  return (
    <Card>
      <SupportedSites />
      <UrlForm triggerScrape={triggerScrape} />
      {isLoadingScrape
        ? <LoadingIndicator />
        : dataScrape
          ? <RecipeForm recipe={dataScrape} />
          : <Warning leftPadded={false} customError={errorScrape} />}
    </Card>
  )
}