import React from 'react'

const SubmitButton = props => (
  <button
    type="submit"
    disabled={
      !props.url.includes(`allrecipes.com`) &&
      !props.url.includes(`bettycrocker.com`) &&
      !props.url.includes(`bonappetit.com`) &&
      !props.url.includes(`chowhound.com`) &&
      !props.url.includes(`cookinglight.com`) &&
      !props.url.includes(`eatingwell.com`) &&
      !props.url.includes(`epicurious.com`) &&
      // !props.url.includes(`food52.com`) &&
      !props.url.includes(`foodandwine.com`) &&
      !props.url.includes(`foodnetwork.com`) &&
      !props.url.includes(`geniuskitchen.com`) &&
      !props.url.includes(`jamieoliver.com`) &&
      !props.url.includes(`myrecipes.com`) &&
      !props.url.includes(`seriouseats.com/recipes`) &&
      !props.url.includes(`simplyrecipes.com`) &&
      !props.url.includes(`thekitchn.com`)
    }
    id="sub-btn"
  >
  Scrape!
  </button>
)

export default SubmitButton
