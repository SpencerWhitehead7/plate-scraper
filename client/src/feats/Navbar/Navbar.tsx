import { Link } from "@tanstack/react-router"
import React from "react"

import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { openAuthModal as openAuthModalAction } from "@/comps/Modal"
import { URL } from "@/consts"
import { useAppDispatch, useGetMeQuery } from "@/reducers"
import skele from "@/skeleton.module.css"

// @ts-expect-error-static-asset
import logoSvg from "../../../../public/logo.svg"
import s from "./Navbar.module.scss"

export const Navbar: React.FC = () => {
  const { isLoading: isLoadingMe, data: dataMe } = useGetMeQuery()

  const dispatch = useAppDispatch()
  const openAuthModal = () => {
    dispatch(openAuthModalAction())
  }

  return (
    <nav className={s.navbar}>
      <Link
        {...URL.base()}
        className={`${s.navbar__logoTitle} ${s.navbar__link}`}
      >
        <img
          src={logoSvg as string}
          alt="plate scraper logo"
          className={s.navbar__logo}
        />
        <span className={s.navbar__title}>Plate Scraper!</span>
      </Link>
      <Link
        {...URL.recipesAll()}
        className={s.navbar__link}
        activeOptions={{ exact: true }}
        activeProps={{
          className: s.navbar__link__active,
        }}
      >
        Recipes
      </Link>
      <Link
        {...URL.usersAll()}
        className={s.navbar__link}
        activeOptions={{ exact: true }}
        activeProps={{
          className: s.navbar__link__active,
        }}
      >
        Users
      </Link>
      {isLoadingMe ? (
        <LoadingIndicator /> // TODO: apply size
      ) : dataMe ? (
        <Link
          {...URL.user(dataMe.id)}
          className={s.navbar__link}
          activeOptions={{ exact: true }}
          activeProps={{
            className: s.navbar__link__active,
          }}
        >
          My Account
        </Link>
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
