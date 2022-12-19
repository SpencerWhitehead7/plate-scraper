import React from 'react'

import { Card } from '@/comps/Card'
import { RecipeForm, Warning } from '@/comps/Form'
import { LoadingIndicator } from '@/comps/LoadingIndicator'
import { useScrapeMutation } from '@/reducers'

import { SupportedSites } from './SupportedSites'
import { UrlForm } from './UrlForm'

export const Scrape: React.FC<{}> = () => {
  const [triggerScrape, stateScrape] = useScrapeMutation()
  const { isLoading: isLoadingScrape, data: dataScrape, error: errorScrape } = stateScrape

  const submit = async (url: string) => {
    await triggerScrape({ url })
  }

  return (
    <Card>
      <SupportedSites />
      <UrlForm submit={submit} />
      {isLoadingScrape
        ? <LoadingIndicator />
        : dataScrape
          ? <RecipeForm recipe={dataScrape} />
          : <Warning
            leftPadded={false}
            customError={errorScrape && "Error scraping recipe"}
          />
      }
    </Card>
  )
}
