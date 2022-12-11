import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { URL } from '@/consts'
import Card, { CardTitle } from '@/comps/Card'
import { FormInputButtonBar, FormSubmit } from '@/comps/Form'
import LoadingIndicator from '@/comps/LoadingIndicator'
import { RecipeRows } from '@/comps/RecipeRows'
import { useAppSelector, useLazyGetRecipesByTagQuery } from '@/reducers'

export const Search = () => {
  const navigate = useNavigate()

  const queryParams = useAppSelector(s => s.routeReducer.query)
  const tags = useMemo(() => Object.values(queryParams).map(String), [queryParams])

  const [getRecipeByTagTrigger, getRecipeByTagState] = useLazyGetRecipesByTagQuery()
  const { isLoading: isLoadingGetRecipesByTagState, data: dataGetRecipesByTagState } = getRecipeByTagState

  const { formState, handleSubmit, register, setValue } = useForm({ mode: `onChange` })

  useEffect(() => {
    if (tags.length) {
      setValue(`searchTerms`, tags.join(` `))
      getRecipeByTagTrigger({ tags })
    }
  }, [tags, setValue, getRecipeByTagTrigger])

  const onSubmit = handleSubmit(({ searchTerms }) => {
    const tags = searchTerms
      .toLowerCase()
      .replace(/[^a-z\s]/gi, ``)
      .replace(/\s\s+/g, ` `)
      .trim()
      .split(` `)

    navigate(URL.search(tags), { replace: true })
  })

  return (
    <Card>
      <CardTitle>Search</CardTitle>
      <form onSubmit={onSubmit}>
        <FormInputButtonBar
          identifier="searchTerms"
          labelText="Search for recipes by tag"
          register={register(`searchTerms`)}
          errors={formState.errors}
          Button={<FormSubmit formState={formState} value="Search!" />}
          autoComplete="off"
          placeholder="fish entre cod"
        />
      </form>
      {isLoadingGetRecipesByTagState
        ? <LoadingIndicator />
        : dataGetRecipesByTagState && (
          <>
            <p>{`${dataGetRecipesByTagState.length} recipes with these tags`}</p>
            <RecipeRows recipes={dataGetRecipesByTagState} />
          </>
        )}
    </Card>
  )
}