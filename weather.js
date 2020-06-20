const axios = require('axios');
const cheerio = require('cheerio');
const colors = require('colors');

let coordinates;

// takes in a city from third argument, or set a default (spaces must be _ w/ first letters captilized)
let city = capitalizeFirst(process.argv[2]);
// takes in state from fourth argument or uses default if undefined (spaces must be _ w/ first letters captilized)
let state =
  process.argv[3] === undefined ? 'Illinois' : capitalizeFirst(process.argv[3]);

// console.log(city, state);

axios
  .get(`https://en.wikipedia.org/wiki/${city},_${state}`)
  .then(response => {
    if (response.status === 200) {
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
      // let temp = $('.today_nowcard-temp').text();
      // let desc = $('.today_nowcard-phrase').text();
      // let feels = $('.today_nowcard-feels').text();
      // let location = $('.today_nowcard-location').text();
      let temp = $(
        '._-_-components-src-organism-CurrentConditions-CurrentConditions--tempValue--MHmYY'
      ).text();
      let desc = $(
        '._-_-components-src-organism-CurrentConditions-CurrentConditions--phraseValue--mZC_p'
      ).text();
      let feels = $(
        '._-_-components-src-organism-TodayDetailsCard-TodayDetailsCard--feelsLikeTempValue--2icPt'
      ).text();
      let location = $(
        '._-_-components-src-organism-CurrentConditions-CurrentConditions--location--1YWj_'
      ).text();
      let prec = $(
        '._-_-components-src-organism-CurrentConditions-CurrentConditions--precipValue--2aJSf'
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
    console.log(`\nUnable to find the weather for ${city}...\n`.red);
  });

function capitalizeFirst(string) {
  if (string.includes('_')) {
    let str_arr = string.split('_');

    str_arr.forEach((str, i) => {
      str_arr[i] = str.charAt(0).toUpperCase() + str.slice(1);
    });

    let new_str = str_arr.join('_');

    return new_str;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}
