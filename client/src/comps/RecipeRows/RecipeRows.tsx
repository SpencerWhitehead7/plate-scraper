import { Link } from "@tanstack/react-router"
import React from "react"

import { ApiRecipe } from "@/@types/apiContract"
import { ButtonSection, DownloadButton, ForkButton } from "@/comps/Buttons"
import { Tags } from "@/comps/Tags"
import { URL } from "@/consts"
import sg from "@/styles/index.module.scss"

import s from "./RecipeRows.module.scss"

const RecipeRow: React.FC<ApiRecipe> = ({
  createdBy,
  forkedCount,
  id,
  sourceSite,
  tags,
  text,
  title,
  userId,
}) => (
  <div className={s.recipeRow}>
    <div className={s.recipeRow__info}>
      <div>
        <div>
          <Link {...URL.recipe(id)}>{title}</Link>
          {` - ${sourceSite}`}
        </div>
        <Tags tags={tags} />
      </div>

      {/* TODO: give authed user to recipeRows so that ownedBy and createdBy can show "Me" if it's yours */}
      <div>
        <div>
          <div>
            Created&nbsp;by&nbsp;
            <Link {...URL.user(createdBy)} className={sg.pr_m}>
              {createdBy}
            </Link>
          </div>
          <div>
            Owned&nbsp;by&nbsp;
            <Link {...URL.user(userId)}>{userId}</Link>
          </div>
        </div>
        <div>{`Forked ${forkedCount} times`}</div>
      </div>
    </div>

    <ButtonSection>
      <DownloadButton text={text} title={title} />
      <ForkButton recipeId={id} userId={userId} />
    </ButtonSection>
  </div>
)

type Props = {
  recipes: ApiRecipe[]
}

export const RecipeRows: React.FC<Props> = ({ recipes }) => (
  <>
    {recipes.map((recipe: ApiRecipe) => (
      <RecipeRow key={recipe.id} {...recipe} />
    ))}
  </>
)
