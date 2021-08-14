import React from 'react'
import classnames from 'classnames'

import { SUPPORTED_SITES } from 'consts'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'
import s from './SupportedSites.scss'

const Cell = ({ site }) => <a key={site} className={classnames(skele[`one-third`], skele.column, sg.textCenter)} href={`https://www.${site}`}>{site}</a>

const Row = ({ row }) => (
  <div className="row">
    {row.map(site => <Cell key={site} site={site} />)}
  </div>
)

const SupportedSites = () => {
  const columnCount = 3
  const rowCount = Math.ceil(SUPPORTED_SITES.length / columnCount)
  const rows = SUPPORTED_SITES.reduce(
    (rowsArr, site, i) => {
      rowsArr[i % rowsArr.length].push(site)
      return rowsArr
    },
    new Array(rowCount).fill(null).map(_ => []),
  )

  return (
    <section className={s.supportedSites}>
      <h3 className={sg.textCenter}> Supported Sites</h3>
      <div className={skele.container}>
        {rows.map(row => <Row key={row[0]} row={row} />)}
      </div>
    </section>
  )
}

export default SupportedSites
