import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { scrapeAsyncHandler } from 'reducers/asyncHandlers'
import { SUPPORTED_SITES } from 'consts'
import { Submit, Warning } from 'comps/Form'

import s from './UrlForm.scss'

const UrlForm = ({ scrape }) => {
  const { errors, formState, handleSubmit, register } = useForm({ mode: `onBlur` })

  return (
    <form onSubmit={handleSubmit(({ url }) => { scrape(url) })} className={s.urlForm}>
      <label htmlFor="url">
        Recipe url
        <Warning rhfError={errors.url} />
      </label>
      <div className={s.urlForm__inputBar}>
        <input
          id="url"
          name="url"
          type="text"
          ref={register({
            required: `required`,
            validate: {
              correctSeriousEats: value => (!value.toLowerCase().includes(`seriouseats.com`) || value.toLowerCase().includes(`seriouseats.com/recipes`)) || `Make sure your url is from seriouseats.com/recipes, not just seriouseats.com`,
              siteSupported: value => SUPPORTED_SITES.some(site => value.toLowerCase().includes(site)) || `Site is not supported`,
            },
          })}
          className={s.urlForm__input}
          placeholder="https://www.allrecipes.com/recipe/22918/pop-cake/"
        />
        <Submit
          formState={formState}
          value="Scrape!"
        />
      </div>
    </form>
  )
}

const mdtp = dispatch => ({
  scrape: url => dispatch(scrapeAsyncHandler.call(url)),
})

export default connect(null, mdtp)(UrlForm)
