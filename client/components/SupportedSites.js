import React from 'react'

const SupportedSites = () => {
  return (
    <div>
      <h3 id="site-label"> Supported Sites: </h3>
      <div id="site-cols-container">
        <div className="site-col">
          <a href="https://www.allrecipes.com">allrecipes.com</a>
          <a href="https://www.bettycrocker.com">bettycrocker.com</a>
          <a href="https://www.bonappetit.com">bonappetit.com</a>
          <a href="https://www.chowhound.com">chowhound.com</a>
          <a href="https://www.cookinglight.com">cookinglight.com</a>
        </div>
        <div className="site-col">
          <a href="https://www.eatingwell.com">eatingwell.com</a>
          <a href="https://www.epicurious.com">epicurious.com</a>
          <a href="https://www.food52.com">food52.com</a>
          <a href="https://www.foodandwine.com">foodandwine.com</a>
          <a href="https://www.foodnetwork.com">foodnetwork.com</a>
          <a href="https://www.geniuskitchen.com">geniuskitchen.com</a>
        </div>
        <div className="site-col">
          <a href="https://www.jamieoliver.com">jamieoliver.com</a>
          <a href="https://www.myrecipes.com">myrecipes.com</a>
          <a href="https://www.thekitchn.com">thekitchn.com</a>
          <a href="https://www.simplyrecipes.com">simplyrecipes.com</a>
          <a href="https://www.seriouseats.com/recipes">seriouseats.com/recipes</a>
        </div>
      </div>
    </div>
  )
}

export default SupportedSites