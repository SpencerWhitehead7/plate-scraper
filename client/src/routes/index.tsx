import { createFileRoute } from "@tanstack/react-router"
import classnames from "classnames"
import React from "react"
import { useForm } from "react-hook-form"

import { Card, CardTitle } from "@/comps/Card"
import {
  FormInputButtonBar,
  FormSubmit,
  RecipeForm,
  Warning,
} from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { SUPPORTED_SITES, SUPPORTED_SITES_FOR_DISPLAY } from "@/consts"
import { useScrapeMutation } from "@/reducers"
import skele from "@/skeleton.module.css"
import sg from "@/styles/index.module.scss"

export const Home: React.FC = () => {
  const [triggerScrape, stateScrape] = useScrapeMutation()
  const {
    isLoading: isLoadingScrape,
    data: dataScrape,
    error: errorScrape,
  } = stateScrape

  const { formState, handleSubmit, register } = useForm({
    mode: "onBlur",
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = handleSubmit(async (formValues) => {
    await triggerScrape(formValues)
  })

  return (
    <Card>
      <CardTitle>Scrape from the web or upload your recipe</CardTitle>

      <h5 className={sg.textCenter}>Supported Sites</h5>

      <div className={classnames(skele.container, sg.mb_l)}>
        {SUPPORTED_SITES_FOR_DISPLAY.map((row) => (
          <div key={row.join("")} className="row">
            {row.map((site) => (
              <a
                key={site}
                className={classnames(
                  skele["one-third"],
                  skele.column,
                  sg.textCenter,
                )}
                href={`https://www.${site}`}
              >
                {site}
              </a>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <FormInputButtonBar
          identifier="url"
          labelText="Recipe url"
          register={register}
          registerOptions={{
            required: "required",
            validate: {
              correctSeriousEats: (v: string) => {
                const sanitized = v.toLowerCase()
                return sanitized.includes("seriouseats.com") &&
                  !sanitized.includes("seriouseats.com/recipes")
                  ? "Make sure your url is from seriouseats.com/recipes, not just seriouseats.com"
                  : undefined
              },
              siteSupported: (v: string) => {
                const sanitized = v.toLowerCase()
                return !SUPPORTED_SITES.some((site) => sanitized.includes(site))
                  ? "Site is not supported"
                  : undefined
              },
            },
          }}
          errors={formState.errors}
          Button={<FormSubmit formState={formState} value="Scrape!" />}
          placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
        />
      </form>

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

export const Route = createFileRoute("/")({
  component: Home,
})
