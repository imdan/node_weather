#!/usr/bin/env node

const getWeather = require('../lib/weather.js');
const { printWeather, parseArgs } = require('../utils/utils.js');
const colors = require('colors');

// Must be capitalized and use _ for spaces
const defaults = {
  city: 'Chicago',
  state: 'Illinois'
};

const main = async () => {
  const { city, state } = parseArgs(process.argv, defaults);
  const weather = await getWeather(city, state);

  printWeather(weather);
};

main();
