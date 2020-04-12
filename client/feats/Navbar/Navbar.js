import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import Modal from './Modal'

import skele from '../../skeleton.css'
import s from './Navbar.scss'

const Navbar = ({ user }) => {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  return (
    <>

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
        <NavLink exact to="/scrape/photo">
          <b>Scrape from photo</b>
        </NavLink>
        <NavLink exact to="/scrape/manual">
          <b>Enter manually</b>
        </NavLink>

        <NavLink exact to="/search">
          <b>Search</b>
        </NavLink>

        {user.id ? (
          <NavLink exact to={`/user/${user.id}`}>
            <b>My Account</b>
          </NavLink>
        )
          : (
            <button type="button" className={skele[`button-primary`]} onClick={toggleModal}>
              Signup&nbsp;/&nbsp;Login
            </button>
          )}
      </nav>

      {showModal && <Modal toggleModal={toggleModal} />}

    </>
  )
}

const mstp = state => ({
  user: state.user,
})

export default connect(mstp, null)(Navbar)
