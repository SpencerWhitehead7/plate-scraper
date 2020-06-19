# Recipe-Scraper

The core of a recipe gathering/organization webapp. It currently has an couple ways to add recipes (scrape from a recipe aggregation site or upload it yourself) and an account system which lets you save/store recipes. You can view and search any recipes saved on the site, and edit or download your own recipes. See the feature roadmap for

## Seeing it

The site is not currently deployed live anywhere, as it's still a little rough and not quite feature complete. However, if you have a relatively recent version of PostgreSQL, Node and NPM installed, you should be able to run it locally. You will need to create an PostgreSQL database with the appropriate name, git clone the repo, then run `npm install`, `npm run build`, `npm run start` in your terminal from within the folder and open localhost:1337 in a browser.

## Public roadmap (features)

- Ability to upload an image and have it OCRed for recipe text instead of typing the recipe manually on the recipe upload page
- Ability to filter recipes by tag on a user's page
- Ability to "fork" another user's recipe, giving you a copy of it you own and can edit
- Ability to download all a user's recipes at once (including your own)
- Ability to view all users and some interesting metadata (member since? Recipe count? Uploaded vs scraped vs forked?)
- Add whatever that metadata ends up being to individual users' pages
- Ability to create collections of your and others' recipes
- Ability to share recipes or collections (...somehow; I don't want to do a social media integration)
- Figure out a way to scape websites that block server-requests for their pages (looking at you, food52 and thekitchn.com)
- Add support for more websites
- Make into a PWA, someday

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
- Search for recipes by tag
- Fully functioning and optimized Webpack/Babel build pipeline with hot reloading
- Solid first draft on SCSS design system
- TypeScript backend using TypeORM
