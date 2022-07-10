const axios = require('axios');
const cheerio = require('cheerio');
const {user_agents} = require('../user_agents');

const random_user_agent = user_agents[Math.floor(Math.random() * user_agents.length)]

const parseWiki = data => {
  // pulls coordinates from wikipedia page
  const $ = cheerio.load(data);
  let find_coords = $('span .geo')[1].children;
  let coords = find_coords[0].data;
  let coords_arr = coords.split('; ');

  // format coordinates correctly
  coords_arr.forEach((num, i) => {
    num = parseFloat(num);
    coords_arr[i] = num.toFixed(2);
  });

  return coords_arr.join(',');
};

const parseWeather = data => {
  // pulls weather data from weather.com/.../coordinates

  const tempClass = 'CurrentConditions--tempValue--3a50n';
  const descClass = 'CurrentConditions--phraseValue--2Z18W';
  const feelsClass = 'TodayDetailsCard--feelsLikeTempValue--Cf9Sl';
  const locationClass = 'CurrentConditions--location--kyTeL';
  const precClass = 'CurrentConditions--precipValue--3nxCj';

  const $ = cheerio.load(data);
  let temp = $(`span[class=${tempClass}]`).text();
  let desc = $(`div[class=${descClass}]`).text();
  let feels = $(`span[class=${feelsClass}]`).text();
  let location = $(`h1[class=${locationClass}]`).text();
  let prec = $(`div[class=${precClass}]`).text();
  let time = new Date().toLocaleTimeString('en-us', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric'
  });

  return {
    temp,
    desc,
    feels,
    location,
    prec,
    time
  };
};


const scrapeCoords = async (city, state) => {
  // request and returns coords from wikipedia page
  try {
    const wikiReq = await axios.get(
      `https://en.wikipedia.org/wiki/${city},_${state}`
    );

    // console.log(wikiReq.status)

    if (wikiReq.status === 200) {
      const wikiRes = wikiReq.data;
      const coordinates = parseWiki(wikiRes);
      return coordinates;
    } else {
      throw new Error();
    }
  } catch(err) {
    console.error(`\nnot good dawg....can't find ${city}'s coordinates\n`.red);
    return false;
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
      throw new Error();
    }
  } catch (err) {
    console.error(`\noh geez...can't find the ${city}'s weather\n`.red);
    return false;
  }
};

module.exports = {
  scrapeCoords,
  scrapeWeather
};
