#!/usr/bin/env node

const getWeather = require('../lib/weather.js');

// remove node and script name from args
var args = process.argv.splice(process.execArgv.length + 2);

// takes in a city from first argument, or set a default (spaces must be _ w/ first letters captilized)
let city = args[0] === undefined ? 'Chicago' : capitalizeFirst(args[0]);
// takes in state from second argument or uses default if undefined (spaces must be _ w/ first letters captilized)
let state = args[1] === undefined ? 'Illinois' : capitalizeFirst(args[1]);

// console.log(city, state);

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

getWeather(city, state);
