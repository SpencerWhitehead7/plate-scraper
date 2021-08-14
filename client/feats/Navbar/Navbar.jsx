import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { URL } from 'consts'
import { selectMe } from 'selectors'
import { MODAL_TYPES, openModal as openModalAction } from 'comps/Modal'

import skele from 'skeleton.css'
import s from './Navbar.scss'

const Navbar = ({ data, openModal }) => (
  <nav className={s.navbar}>
    <span className={s.navbar__logoTitleArea}>
      <NavLink to={URL.base}>
        <img src="/logo.svg" alt="plate scraper logo" className={s.navbar__logo} />
      </NavLink>
      <span className={s.navbar__title}>
        <b>Plate Scraper!</b>
      </span>
    </span>

    <NavLink exact to={URL.scrape}>
      <b>Scrape from website</b>
    </NavLink>
    <NavLink exact to={URL.upload}>
      <b>Upload</b>
    </NavLink>

    <NavLink exact to="/search">
      <b>Search</b>
    </NavLink>

    {data && data.id
      ? (
        <NavLink exact to={URL.user(data.id)}>
          <b>My Account</b>
        </NavLink>
      )
      : (
        <button
          type="button"
          className={skele[`button-primary`]}
          onClick={openModal}
        >
          Signup&nbsp;/&nbsp;Login
        </button>
      )}
  </nav>
)

const mstp = state => ({
  ...selectMe(state),
})
const mdtp = dispatch => ({
  openModal: () => {
    dispatch(openModalAction(MODAL_TYPES.AUTH))
  },
})

export default connect(mstp, mdtp)(Navbar)
