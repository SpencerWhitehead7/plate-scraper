import React from 'react'

import s from './Scrape.scss'

const SubmitButton = ({ url }) => (
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
    className={s.scrapeBtn}
  >
    Scrape!
  </button>
)

export default SubmitButton
