const axios = require('axios');
const cheerio = require('cheerio');
const colors = require('colors');

const getWeather = (city, state) => {
  axios
    .get(`https://en.wikipedia.org/wiki/${city},_${state}`)
    .then(response => {
      if (response.status === 200) {
        let coordinates;
        //   Gets coordinates from wikipedia and put them into coordinates var
        const html = response.data;
        const $ = cheerio.load(html);
        let find_coords = $('span .geo')[1].children;
        let coords = find_coords[0].data;
        let coords_arr = coords.split('; ');

        // format coordinates correctly
        coords_arr.forEach((num, i) => {
          num = parseFloat(num);
          coords_arr[i] = num.toFixed(2);
        });

        coordinates = coords_arr.join(',');

        // uses coordinates to make request to weather.com
        return axios.get(`https://weather.com/weather/today/l/${coordinates}`);
      }
    })
    .then(response => {
      if (response.status === 200) {
        // get weather data from weather.com
        const html = response.data;
        const $ = cheerio.load(html);
        let temp = $(
          'span[class="_-_-node_modules-@wxu-components-src-organism-CurrentConditions-CurrentConditions--tempValue--3KcTQ"]'
        ).text();
        let desc = $(
          'div[class="_-_-node_modules-\@wxu-components-src-organism-CurrentConditions-CurrentConditions--phraseValue--2xXSr"]'
        ).text();
        let feels = $(
          'span[class="_-_-node_modules-\@wxu-components-src-organism-TodayDetailsCard-TodayDetailsCard--feelsLikeTempValue--2aogo"]'
        ).text();
        let location = $(
          'h1[class="_-_-node_modules-\@wxu-components-src-organism-CurrentConditions-CurrentConditions--location--1Ayv3"]'
        ).text();
        let prec = $(
          'div[class="_-_-node_modules-\@wxu-components-src-organism-CurrentConditions-CurrentConditions--precipValue--RBVJT"]'
        ).text();
        let time = new Date().toLocaleTimeString('en-us', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric'
        });

        // log the current weather
        if (prec !== '') {
          console.log(
            `\n${location} (${time}): Currently ${temp} and ${desc}, feels like ${feels} with a ${prec}\n`
              .brightYellow.bgBlue
          );
        } else {
          console.log(
            `\n${location} (${time}): Currently ${temp} and ${desc}, feels like ${feels}\n`
              .brightYellow.bgBlue
          );
        }
      }
    })
    .catch(err => {
      console.error(err.message);
      console.log(`\nUnable to find the weather for ${city}...\n`.red);
    });
};

module.exports = getWeather;
