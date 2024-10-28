import { createFileRoute } from "@tanstack/react-router"
import { useNavigate, useSearch } from "@tanstack/react-router"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useQueryRecipesAll } from "@/api"
import { Card, CardTitle } from "@/comps/Card"
import { FormInputButtonBar, FormSubmit } from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { RecipeRows } from "@/comps/RecipeRows"
import { PATH, URL } from "@/consts"

export const RecipesAll: React.FC = () => {
  const navigate = useNavigate()

  const { tags } = useSearch({ from: PATH.recipesAll })

  const { isPending: isPendingRecipesAll, data: dataRecipesAll } =
    useQueryRecipesAll(tags?.length ? tags : undefined)

  const { formState, handleSubmit, register, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      searchTerms: "",
    },
  })

  useEffect(() => {
    if (tags?.length) {
      setValue("searchTerms", tags.join(" "))
    }
  }, [tags, setValue])

  const onSubmit = handleSubmit(({ searchTerms }) => {
    const trimmedSearchTerms = searchTerms.trim()
    if (trimmedSearchTerms === "") {
      void navigate({ ...URL.recipesAll(), replace: true })
    } else {
      const tags = trimmedSearchTerms
        .toLowerCase()
        .replace(/[^a-z\s]/gi, "")
        .replace(/\s\s+/g, " ")
        .split(" ")

      void navigate({ ...URL.recipesAll(tags), replace: true })
    }
  })

  return (
    <Card>
      <CardTitle>Search</CardTitle>
      <form onSubmit={onSubmit}>
        <FormInputButtonBar
          identifier="searchTerms"
          labelText="Search for recipes by tag"
          register={register}
          errors={formState.errors}
          Button={<FormSubmit formState={formState} value="Search!" />}
          autoComplete="off"
          placeholder="fish entre cod"
        />
      </form>
      {isPendingRecipesAll ? (
        <LoadingIndicator />
      ) : (
        dataRecipesAll && (
          <>
            <p>{`${dataRecipesAll.length} recipes with these tags`}</p>
            <RecipeRows recipes={dataRecipesAll} />
          </>
        )
      )}
    </Card>
  )
}

type SearchParams = {
  tags?: string[]
}

export const Route = createFileRoute("/recipes/")({
  component: RecipesAll,
  validateSearch: ({ tags }): SearchParams => ({
    tags: Array.isArray(tags) ? tags : undefined,
  }),
})
