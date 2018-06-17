import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => (
  <div>
    <NavLink to="/" activeStyle={{ fontWeight : `bold` }} className="navbar-link">Main</NavLink>
    <NavLink exact to="/account" activeStyle={{ fontWeight : `bold` }} className="navbar-link">Account</NavLink>
  </div>
)

export default Navbar