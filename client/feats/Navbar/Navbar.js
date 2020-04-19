import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { MODAL_TYPES, openModal as openModalAction } from 'comps/Modal'

import skele from 'skeleton.css'
import s from './Navbar.scss'

const Navbar = ({ me, openModal }) => (
  <nav className={s.navbar}>
    <span className={s.navbar__logoTitleArea}>
      <NavLink to="/">
        <img src="/logo.svg" className={s.navbar__logo} />
      </NavLink>
      <span className={s.navbar__title}>
        <b>Plate Scraper!</b>
      </span>
    </span>

    <NavLink exact to="/scrape/website">
      <b>Scrape from website</b>
    </NavLink>
    {/* <NavLink exact to="/scrape/photo">
      <b>Scrape from photo</b>
    </NavLink>
    <NavLink exact to="/scrape/manual">
      <b>Enter manually</b>
    </NavLink>

    <NavLink exact to="/search">
      <b>Search</b>
    </NavLink> */}

    {me.data && me.data.id ? (
      <NavLink exact to={`/user/${me.data.id}`}>
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
  me: authAsyncHandler.select(state),
})
const mdtp = dispatch => ({
  openModal: () => dispatch(openModalAction(MODAL_TYPES.AUTH)),
})

export default connect(mstp, mdtp)(Navbar)
