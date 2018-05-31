# Recipe-Scraper

-------General info-------

A node JS script for scraping titles, ingredient lists and instructions from cooking websites

Tragically, the only cooking website it currently supports is seriouseats.com. I hope to eventually add support for the five or ten most visited recipe websites, assuming I can make sense of their horrible morasses of html (seriously, allrecipes.com is like something out of a nightmare). logic.js saves the relevant information (recipe's title, ingredient list, and instructions) to an object and then turns the object into a formatted string and saves that to a file.

The frontend component isn't done yet, but we're getting there. Eventually

-------Getting it to work-------

This program's other tragic limitations:

  It only works in node js; you need to have node installed on your computer, and you need a command line program. If you do, run the script by navigating to its directory in the command line and using the command "node logic.js"

  It requires many npm modules; install them by navigating to the script's directory in the command line and using the command "npm install"

  You have to manually paste the URL of the recipe you want scraped into the "const testUrl" field. However, you can ignore the rest of the script entirely if you'd like.

