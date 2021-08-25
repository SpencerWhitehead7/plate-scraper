import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import qs from 'qs'

import { searchAsyncHandler } from 'reducers/asyncHandlers'
import { selectRouteQuery } from 'selectors'
import Card, { CardTitle } from 'comps/Card'
import { FormInputButtonBar, FormSubmit } from 'comps/Form'
import LoadingIndicator from 'comps/LoadingIndicator'
import RecipeRows from 'comps/RecipeRows'
import { selectSearch } from './selectors'

const Search = ({ queryParams, data: searchResults, isLoading, fetchResults }) => {
  const history = useHistory()
  const { errors, formState, handleSubmit, register, setValue } = useForm({ mode: `onChange` })

  useEffect(() => {
    if (!formState.isSubmitted) {
      const tags = Object.values(queryParams)
      if (tags.length) {
        setValue(`searchTerms`, tags.join(` `))
        fetchResults(tags)
      }
    }
  }, [formState.isSubmitted, queryParams, setValue, fetchResults])

  const onSubmit = ({ searchTerms }) => {
    const tags = searchTerms
      .toLowerCase()
      .replace(/[^a-z\s]/gi, ``)
      .replace(/\s\s+/g, ` `)
      .trim()
      .split(` `)

    fetchResults(tags)
    history.replace(`${location.pathname}${qs.stringify(tags, { addQueryPrefix: true })}`)
  }

  return (
    <Card>
      <CardTitle>Search</CardTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputButtonBar
          identifier="searchTerms"
          labelText="Search for recipes by tag"
          register={register()}
          errors={errors}
          Button={<FormSubmit formState={formState} value="Search!" />}
          autoComplete="off"
          placeholder="fish entre cod"
        />
      </form>
      {isLoading
        ? <LoadingIndicator />
        : searchResults && (
          <>
            <p>{`${searchResults.length} recipes with these tags`}</p>
            <RecipeRows recipes={searchResults} />
          </>
        )}
    </Card>
  )
}

const mstp = state => ({
  queryParams: selectRouteQuery(state),
  ...selectSearch(state),
})

const mdtp = dispatch => ({
  fetchResults: tags => {
    dispatch(searchAsyncHandler.call(tags))
  },
})

export default connect(mstp, mdtp)(Search)
