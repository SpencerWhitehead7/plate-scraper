import { Link } from "@tanstack/react-router"
import React from "react"

import { useQueryMe } from "@/api"
import { URL } from "@/consts"
import skele from "@/skeleton.module.css"

// @ts-expect-error-static-asset
import logoSvg from "../../../../public/logo.svg"
import { useCtxModal } from "../Modal"
import s from "./Navbar.module.scss"

export const Navbar: React.FC = () => {
  const { openModalAuth } = useCtxModal()

  const { data: dataMe } = useQueryMe()

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
      {dataMe ? (
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
          onClick={openModalAuth}
        >
          Signup&nbsp;/&nbsp;Login
        </button>
      )}
    </nav>
  )
}
