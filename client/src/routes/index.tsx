import { createFileRoute } from "@tanstack/react-router"
import classnames from "classnames"
import React from "react"
import { useForm } from "react-hook-form"

import { useMutationScrape } from "@/api"
import { Card, CardTitle } from "@/comps/Card"
import {
  FormInputButtonBar,
  FormSubmit,
  RecipeForm,
  Warning,
} from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { SUPPORTED_SITES, SUPPORTED_SITES_FOR_DISPLAY } from "@/consts"
import skele from "@/skeleton.module.css"
import sg from "@/styles/index.module.scss"

export const Home: React.FC = () => {
  const {
    mutate: triggerScrape,
    isPending: isPendingScrape,
    isError: isErrorScrape,
    isSuccess: isSuccessScrape,
    data: dataScrape,
  } = useMutationScrape()

  const { formState, handleSubmit, register } = useForm({
    mode: "onBlur",
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = handleSubmit((formValues) => {
    triggerScrape(formValues)
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

      {isPendingScrape ? (
        <LoadingIndicator />
      ) : isErrorScrape ? (
        <Warning leftPadded={false} customError={"Error scraping recipe"} />
      ) : isSuccessScrape ? (
        <RecipeForm recipe={dataScrape} />
      ) : null}
    </Card>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
})
