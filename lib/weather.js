const { scrapeCoords, scrapeWeather } = require('../utils/scrapers');

const getWeather = async (city, state) => {
  console.log(`gathering coordinates...`.yellow);
  const coordinates = await scrapeCoords(city, state);

  console.log(`checking current weather...`.yellow);
  const weather = await scrapeWeather(coordinates);

  return weather;
};

module.exports = getWeather;
