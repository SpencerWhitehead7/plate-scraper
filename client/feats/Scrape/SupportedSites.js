import React from 'react'
import classnames from 'classnames'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'
import s from './SupportedSites.scss'

const SupportedSites = () => (
  <section className={s.supportedSites}>
    <h3 className={sg.textCenter}> Supported Sites</h3>
    <div className={skele.container}>
      <div className={skele.row}>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.allrecipes.com">allrecipes.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.bettycrocker.com">bettycrocker.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.bonappetit.com">bonappetit.com</a>
      </div>

      <div className="row">
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.chowhound.com">chowhound.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.cookinglight.com">cookinglight.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.eatingwell.com">eatingwell.com</a>
      </div>

      <div className="row">
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.epicurious.com">epicurious.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.food.com">food.com</a>
        {/* <a className={classnames(skele[`one-third`],  skele.column, sg.textCenter)} href="https://www.food52.com">food52.com</a> uncomment if I ever get it working */}
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.foodandwine.com">foodandwine.com</a>
      </div>

      <div className="row">
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.foodnetwork.com">foodnetwork.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.jamieoliver.com">jamieoliver.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.myrecipes.com">myrecipes.com</a>
      </div>

      <div className="row">
        {/* <a className={classnames(skele[`one-third`],  skele.column, sg.textCenter)} href="https://www.thekitchn.com">thekitchn.com</a> uncomment if I ever get it working */}
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.simplyrecipes.com">simplyrecipes.com</a>
        <a className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href="https://www.seriouseats.com/recipes">seriouseats.com/recipes</a>
      </div>
    </div>
  </section>
)

export default SupportedSites
