const { scrapeCoords, scrapeWeather } = require('../utils/scrapers');

const getWeather = async (city, state) => {
  console.log(`gathering coordinates...`.yellow);
  const coordinates = await scrapeCoords(city, state);

  if (!coordinates) {return false}

  console.log(`checking current weather...`.yellow);
  const weather = await scrapeWeather(coordinates);

  if (!weather) {return false}

  return weather;
};

module.exports = getWeather;
