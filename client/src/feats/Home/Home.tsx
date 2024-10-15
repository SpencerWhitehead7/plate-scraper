import React from "react"

import { Card, CardTitle } from "@/comps/Card"
import { RecipeForm, Warning } from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { useScrapeMutation } from "@/reducers"

import { SupportedSites } from "./SupportedSites"
import { UrlForm } from "./UrlForm"

export const Home: React.FC = () => {
  const [triggerScrape, stateScrape] = useScrapeMutation()
  const {
    isLoading: isLoadingScrape,
    data: dataScrape,
    error: errorScrape,
  } = stateScrape

  const submit = async (url: string) => {
    await triggerScrape({ url })
  }

  return (
    <Card>
      <CardTitle>Scrape from the web or upload your recipe</CardTitle>
      <SupportedSites />
      <UrlForm submit={submit} />
      {errorScrape ? (
        <Warning leftPadded={false} customError={"Error scraping recipe"} />
      ) : isLoadingScrape ? (
        <LoadingIndicator />
      ) : (
        <RecipeForm recipe={dataScrape ?? {}} />
      )}
    </Card>
  )
}
