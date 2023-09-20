import React from "react"
import { NavLink } from "react-router-dom"

import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { openAuthModal as openAuthModalAction } from "@/comps/Modal"
import { URL } from "@/consts"
import { useAppDispatch, useGetMeQuery } from "@/reducers"
import skele from "@/skeleton.module.css"

import s from "./Navbar.module.scss"

// my scss module solution does not cooperate with their auto-applied "active" class
const linkStyle = {
  textDecoration: "none",
  fontWeight: 600,
}

const activeLinkStyle = {
  ...linkStyle,
  color: "black",
}

export const Navbar = () => {
  const { isLoading: isLoadingMe, data: dataMe } = useGetMeQuery()

  const dispatch = useAppDispatch()
  const openAuthModal = () => {
    dispatch(openAuthModalAction())
  }

  return (
    <nav className={s.navbar}>
      <NavLink
        to={URL.base}
        className={s.navbar__logoTitle}
        style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
      >
        <img
          src="/logo.svg"
          alt="plate scraper logo"
          className={s.navbar__logo}
        />
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
      {isLoadingMe ? (
        <LoadingIndicator /> // TODO: apply size
      ) : dataMe ? (
        <NavLink
          to={URL.user(dataMe.id)}
          end
          style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
        >
          My Account
        </NavLink>
      ) : (
        <button
          type="button"
          className={skele["button-primary"]}
          onClick={openAuthModal}
        >
          Signup&nbsp;/&nbsp;Login
        </button>
      )}
    </nav>
  )
}
