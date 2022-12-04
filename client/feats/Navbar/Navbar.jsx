import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { URL } from 'consts'
import { selectMe } from 'selectors'
import { MODAL_TYPES, openModal as openModalAction } from 'comps/Modal'

import skele from 'skeleton.css'
import s from './Navbar.scss'

// my scss module solution does not cooperate with their auto-applied "active" class
const linkStyle = {
  textDecoration: `none`,
  fontWeight: 600,
}

const activeLinkStyle = {
  ...linkStyle,
  color: `black`,
}

const Navbar = ({ data, openModal }) => (
  <nav className={s.navbar}>
    <NavLink
      to={URL.base}
      className={s.navbar__logoTitle}
      style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
    >
      <img src="/logo.svg" alt="plate scraper logo" className={s.navbar__logo} />
      <span className={s.navbar__title}>Plate Scraper!</span>
    </NavLink>
    <NavLink
      to={URL.scrape}
      end
      style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
    >
      Scrape from website
    </NavLink>
    <NavLink
      to={URL.upload}
      end
      style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
    >
      Upload
    </NavLink>
    <NavLink
      to={URL.search()}
      end
      style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
    >
      Search
    </NavLink>
    {data && data.id
      ? (
        <NavLink
          to={URL.user(data.id)}
          end
          style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
        >
          My Account
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
