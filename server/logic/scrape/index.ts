import axios from "axios";
import { load } from "cheerio";

import allrecipes from "./allrecipes";
import bettycrocker from "./bettycrocker";
import bonappetit from "./bonappetit";
import chowhound from "./chowhound";
import cookinglight from "./cookinglight";
import eatingwell from "./eatingwell";
import epicurious from "./epicurious";
import food from "./food";
// import food52 from "./food52"; // uncomment if I ever get it working
import foodandwine from "./foodandwine";
import foodnetwork from "./foodnetwork";
import jamieoliver from "./jamieoliver";
import myrecipes from "./myrecipes";
import seriousEats from "./seriouseats";
import simplyrecipes from "./simplyrecipes";
// import thekitchn from "./thekitchn"; // uncomment if I ever get it working

const scrape = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);

    if (url.includes("allrecipes.com")) {
      return allrecipes($, url);
    } else if (url.includes("bettycrocker.com")) {
      return bettycrocker($, url);
    } else if (url.includes("bonappetit.com")) {
      return bonappetit($, url);
    } else if (url.includes("chowhound.com")) {
      return chowhound($, url);
    } else if (url.includes("cookinglight.com")) {
      return cookinglight($, url);
    } else if (url.includes("eatingwell.com")) {
      return eatingwell($, url);
    } else if (url.includes("epicurious.com")) {
      return epicurious($, url);
    } else if (url.includes("food.com")) {
      return food($, url);
      // } else if (url.includes("food52.com")) { // uncomment if I ever get it working
      //   return food52($, url)
    } else if (url.includes("foodandwine.com")) {
      return foodandwine($, url);
    } else if (url.includes("foodnetwork.com")) {
      return foodnetwork($, url);
    } else if (url.includes("jamieoliver.com")) {
      return jamieoliver($, url);
    } else if (url.includes("myrecipes.com")) {
      return myrecipes($, url);
    } else if (url.includes("seriouseats.com/recipes")) {
      return seriousEats($, url);
    } else if (url.includes("simplyrecipes.com")) {
      return simplyrecipes($, url);
      // } else if (url.includes("thekitchn.com")) { // uncomment if I ever get it working
      //   return thekitchn($, url)
    } else {
      throw new Error("Scrape failed: invalid site");
    }
  } catch (err) {
    throw err.isAxiosError
      ? new Error(
          "Scrape failed: valid site, but invalid url or request failed"
        )
      : err;
  }
};

export default scrape;
