import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { recipeAsyncHandler } from 'reducers/asyncHandlers'
import { SUPPORTED_SITES } from 'consts'
import { FormInputButtonBar, FormSubmit } from 'comps/Form'

const UrlForm = ({ scrape }) => {
  const { errors, formState, handleSubmit, register } = useForm({ mode: `onBlur` })

  return (
    <form onSubmit={handleSubmit(({ url }) => { scrape(url) })}>
      <FormInputButtonBar
        identifier="url"
        labelText="Recipe url"
        register={register({
          required: `required`,
          validate: {
            correctSeriousEats: value => (!value.toLowerCase().includes(`seriouseats.com`) || value.toLowerCase().includes(`seriouseats.com/recipes`)) || `Make sure your url is from seriouseats.com/recipes, not just seriouseats.com`,
            siteSupported: value => SUPPORTED_SITES.some(site => value.toLowerCase().includes(site)) || `Site is not supported`,
          },
        })}
        errors={errors}
        Button={<FormSubmit formState={formState} value="Scrape!" />}
        placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
      />
    </form>
  )
}

const mdtp = dispatch => ({
  scrape: url => {
    dispatch(recipeAsyncHandler.call(`scrape`, { url }))
  },
})

export default connect(null, mdtp)(UrlForm)
