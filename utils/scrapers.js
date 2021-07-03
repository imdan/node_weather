const axios = require('axios');
const { parseWiki, parseWeather } = require('../utils/utils');

const scrapeCoords = async (city, state) => {
  // request and returns coords from wikipedia page
  try {
    const wikiReq = await axios.get(
      `https://en.wikipedia.org/wiki/${city},_${state}`
    );

    if (wikiReq.status === 200) {
      const wikiRes = wikiReq.data;
      const coordinates = parseWiki(wikiRes);
      return coordinates;
    } else {
      throw new Error(`not good dawg....can't find ${city}'s coordinates`);
    }
  } catch (err) {
    console.error(err.message);
  }
};

const scrapeWeather = async coords => {
  try {
    // uses coordinates to get weather from weather.com
    const weatherReq = await axios.get(
      `https://weather.com/weather/today/l/${coords}`
    );

    if (weatherReq.status === 200) {
      const weatherRes = weatherReq.data;

      const { temp, desc, feels, location, prec, time } = parseWeather(
        weatherRes
      );

      return {
        temp,
        desc,
        feels,
        location,
        prec,
        time
      };
    } else {
      throw new Error(`oh geez...can't find the ${city}'s weather`);
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  scrapeCoords,
  scrapeWeather
};
