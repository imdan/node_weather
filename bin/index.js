#!/usr/bin/env node
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const getWeather = require('../lib/weather.js');
const { printWeather, parseArgs, saveWeather } = require('../utils/utils.js');
const colors = require('colors');

// Must be capitalized and use _ for spaces
const defaults = {
  city: process.env.CURRENT_CITY,
  state: process.env.CURRENT_STATE
};

const main = async () => {
  const { city, state } = parseArgs(process.argv, defaults);
  const weather = await getWeather(city, state);

  if (!weather) {return false}

  if (weather.temp === '' && weather.desc === '') {
    console.log(
      '\nunable to get weather data...update the class names in ./utils/utils.js -> parseWeather()\n'
        .red
    );
  } else {

    //might try to figure out arg flag here to do one or the other...

    printWeather(weather); // prints weather to console
    saveWeather(weather); // saves weather to sqlite db defined in .env var
  }
};

main();
