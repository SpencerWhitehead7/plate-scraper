import React from 'react'

import Warning from './Warning'

import s from './UrlForm.scss'

const UrlForm = ({ handleSubmit, handleChange, url }) => (
  <>
    {
      url.toLowerCase().includes(`seriouseats.com`) && !url.toLowerCase().includes(`seriouseats.com/recipes`) &&
        <Warning err="Make sure your url is from seriouseats.com/recipes, not just seriouseats.com" />
    }
    <form onSubmit={handleSubmit} className={s.urlForm}>
      <input
        type="text"
        name="url"
        placeholder="url of recipe to scrape; https://www.allrecipes.com/recipe/22918/pop-cake/"
        value={url}
        onChange={handleChange}
        className={s.urlForm__input}
      />
      <button
        type="submit"
        disabled={
          !url.includes(`allrecipes.com`) &&
          !url.includes(`bettycrocker.com`) &&
          !url.includes(`bonappetit.com`) &&
          !url.includes(`chowhound.com`) &&
          !url.includes(`cookinglight.com`) &&
          !url.includes(`eatingwell.com`) &&
          !url.includes(`epicurious.com`) &&
          !url.includes(`food.com`) &&
          // !url.includes(`food52.com`) &&
          !url.includes(`foodandwine.com`) &&
          !url.includes(`foodnetwork.com`) &&
          !url.includes(`jamieoliver.com`) &&
          !url.includes(`myrecipes.com`) &&
          !url.includes(`seriouseats.com/recipes`) &&
          !url.includes(`simplyrecipes.com`) // &&
          // !url.includes(`thekitchn.com`)
        }
      >
        Scrape!
      </button>
    </form>
  </>
)

export default UrlForm
