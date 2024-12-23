# Plate Scraper

This monorepo contains all aspects of the plate-scraper project, the scraping logic itself, the webapp, and the chrome extension.

The scraping logic is functions for parsing html pages from various recipe aggregation sites.

The webapp allows you to create, store, and organize recipes. It can scrape recipes from major recipe aggregation sites, or you can upload your own. Recipes can be scraped and downloaded as plaintext without making an account, or saved, edited, organized, etc on the site with an account. You can also view and search recipes saved on the site without an account. For a more comprehensive list of existing and upcoming features, see the shipped features and public roadmap sections. The site is not deployed live anywhere, as is rough and feature incomplete, and probably always will be.

The chrome extension is a minimal version of the site which can only scrape, edit and download. Unlike the site, it is available for use on the [chrome webstore](https://chrome.google.com/webstore/detail/plate-scraper/pohdgoipnoaopknopkpdeooophfnkmel?hl=en-US).

## Local dev

If you have docker, node and npm, you can run the packages and develop locally. The top level folders of this repo contain the different aspects of the project. You will need to `npm install` for each directory individually, and refer to their `package.json` files for test, run, and build commands.

### parsers

These are the functions that actually parse html pages from the recipe aggregation sites. They are used in `extChrome` and `server`.

### extChrome

This is the chrome extension. It is mostly a wrapper for the parsers plus a little extension-specific logic.

### client

This is the FE component of the webapp.

### server

This is the BE component of the webapp. Unlike the other packages, you will also need to run `docker compose up -d` from the directory because the app's database is in a docker container.

## Public roadmap (features)

- Ability to upload an image and have it OCRed for recipe text instead of typing the recipe manually on the recipe upload page
- Ability to filter recipes by tag on a user's page
- Ability to download all a user's recipes at once (including your own)
- Ability to view all users and some interesting metadata (member since? Recipe count? Uploaded vs scraped vs forked?)
- Add whatever that metadata ends up being to individual users' pages
- Ability to create collections of your and others' recipes
- Ability to share recipes or collections (...somehow; I don't want to do a social media integration)
- Pagination on all users, all recipes pages
- LLM integration for parsing arbitrary pages or images of text
- Support for more websites
- PWA

## Public roadmap (technical improvements)

- Once more comps are in a finished state, write FE tests with Jest [FE]
- Deploy it live somewhere [Infra]
- CI/CD system [Infra]
  - Activate Dependabot for the repo
- Create job to automatically run scraper tests once a week or once a month and email me if they fail [Infra]
- Make a cute custom loading indicator that looks like a fork scraping a plate [FE]

## Shipped features

- Actual recipe scraper/editor/downloader
- Account system, signup/login, view, edit, delete account
- Save, view, edit, delete, download scraped recipes, including the other users'
- Set and unset recipe's tags
- "Fork" a recipe (yours or another user's), giving you an editable copy of it
- Search for recipes by tag
- Fully functioning and optimized Webpack/Babel build pipeline with hot reloading
- Solid first draft on SCSS design system
- TypeScript backend using TypeORM
