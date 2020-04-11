import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import Modal from './Modal'

import { logout } from '../../redux'

import s from './Navbar.scss'

const Navbar = ({ logout, user }) => {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  return (
    <>

      <nav className={s.navbar}>
        <img src="/logo.svg" className={s.navbar__logo} />
        <span className={s.navbar__title}>
          Plate Scraper!
        </span>
        <div className={s.navbar__dropdown}>
          <NavLink exact to="/">
            Add&nbsp;Recipe
          </NavLink>
          <div className={s.navbar__dropdownContent}>
            <NavLink exact to="/">
              Scrape
            </NavLink>
            <NavLink exact to="/upload">
              Upload
            </NavLink>
          </div>
        </div>

        <NavLink exact to="/search">
          Search
        </NavLink>

        {user.id ? (
          <div className={s.navbar__dropdown}>
            <NavLink exact to={`/user/${user.id}`}>
              My&nbsp;Account
            </NavLink>
            <div className={s.navbar__dropdownContent}>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )
          : (
            <button type="button" onClick={toggleModal}>
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

const mdtp = dispatch => ({
  logout: () => dispatch(logout()),
})

export default connect(mstp, mdtp)(Navbar)
