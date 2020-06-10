# Recipe-Scraper

The core of a potentially far more ambitious recipe-scraping website. Currently, it is just a single page that you can feed a url, and it will give you back the title, ingredients, and instructions as plaintext, which you can copy, edit, or download. You can also make and log into/out of an account. However, there is no way to save recipes to it (yet), so it's kind of useless.

Also perhaps someday featuring support for more websites.

## Seeing it

Unfortunately, the site is not deployed live anywhere, as it is not feature complete and, tbh, still looks a little rough. However, if you have a relatively recent version of Node and NPM installed, you should be able to run it locally by git cloning it, running `npm install`, then `npm run build` then `npm run start` in your terminal from within the folder, and then opening localhost:1337 in a browser

## Public roadmap (features)

- Form to just type in a recipe, save it to your account with appropriate metadeta
- Form to upload image, use a public API to OCR it and give you the recipe as text, as well as save it to account
- Ability to "fork" another user's recipe, giving you a copy of it you own and can edit
- Ability to download all a user's recipes (including your own)
- Ability to view all users and some interesting metadata (member since? Recipe count? Uploaded vs scraped vs forked?)
- Add whatever that metadata ends up being to individual users' pages
- Ability to create collections of your and others' recipes
- Ability to share recipes or collections (...somehow; I don't want to do a social media integration)
- Figure out a way to scape websites that block server-requests for their pages (looking at you, food52 and thekitchn.com)
- Add support for more websites

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
- Save, view, edit, delete, download scraped recipes
- Set and unset recipe's tags
- Search for recipes by tag
- Fully functioning and optimized Webpack/Babel build pipeline with hot reloading
- Solid first draft on SCSS design system
- TypeScript backend using TypeORM
