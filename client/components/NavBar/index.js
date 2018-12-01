import React, {useState} from 'react'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'

import Modal from './Modal'

import {logout} from '../../redux/rootReducer'

import urls from '../../urls'
import s from './NavBar.css'

const Navbar = props => {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => {setShowModal(!showModal)}

  return (
    <React.Fragment>

      <nav className={s.navbar}>
        <div className={s.dropdown}>
          <NavLink exact to="/">
            <img src={urls.logo} className={s.logo}/>
          </NavLink>
          <NavLink exact to="/" className={s.link}>
        Add&nbsp;Recipe
          </NavLink>
          <div className={s.dropdownContent}>
            <NavLink exact to="/" className={s.link}>
          Scrape
            </NavLink>
            <NavLink exact to="/upload" className={s.link}>
          Upload
            </NavLink>
          </div>
        </div>

        <NavLink exact to="/search" className={s.link}>
          Search
        </NavLink>

        {props.user.id ?
          <div className={s.dropdown}>
            <NavLink exact to="/account" className={s.link}>
              My&nbsp;Account
            </NavLink>
            <div className={s.dropdownContent}>
              <NavLink exact to="/account" className={s.link}>
                Recipes
              </NavLink>
              <NavLink exact to="/settings" className={s.link}>
                Settings
              </NavLink>
              <div
                className={s.link}
                onClick={props.logout}
                // maybe logout should also redirect you if you're on a private page
              >
                Logout
              </div>
            </div>
          </div>
          :
          <div
            className={s.link}
            onClick={toggleModal}
          >
            Signup&nbsp;/&nbsp;Login
          </div>}
      </nav>

      {showModal && <Modal toggleModal={toggleModal}/>}

    </React.Fragment>
  )
}

const mstp = state => ({
  user : state,
})

const mdtp = dispatch => ({
  logout : () => dispatch(logout()),
})

export default connect(mstp, mdtp)(Navbar)
