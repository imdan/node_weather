const cheerio = require('cheerio');

const parseArgs = (argv, defaults) => {
  // removes node and file_path from args
  const args = argv.splice(process.execArgv.length + 2);

  // sets city and state from args or defaults
  let city = args[0] === undefined ? defaults.city : capitalizeArgs(args[0]);
  let state = args[1] === undefined ? defaults.state : capitalizeArgs(args[1]);

  return { city, state };
};

const capitalizeArgs = string => {
  if (string.includes('_')) {
    let str_arr = string.split('_');

    str_arr.forEach((str, i) => {
      str_arr[i] = str.charAt(0).toUpperCase() + str.slice(1);
    });

    let new_str = str_arr.join('_');

    return new_str;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

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
  const $ = cheerio.load(data);
  let temp = $('span[class="CurrentConditions--tempValue--1RYJJ"]').text();
  let desc = $('div[class="CurrentConditions--phraseValue--17s79"]').text();
  let feels = $(
    'span[class="TodayDetailsCard--feelsLikeTempValue--3eUBp"]'
  ).text();
  let location = $('h1[class="CurrentConditions--location--2_osB"]').text();
  let prec = $('div[class="CurrentConditions--precipValue--1RgXi"]').text();
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

const printWeather = weather => {
  // prints current weather to console
  const { temp, desc, feels, location, prec, time } = weather;
  if (prec !== '') {
    console.log(`\n${location} (${time}):`.brightWhite);
    console.log(
      `\nRight now it's ${temp} and ${desc}, feels like ${feels} with a ${prec}\n`
        .brightYellow
    );
  } else {
    console.log(`\n${location} (${time}):`.brightWhite);
    console.log(
      `\nRight now it's ${temp} and ${desc}, feels like ${feels}\n`.brightYellow
    );
  }
};

module.exports = {
  capitalizeArgs,
  parseArgs,
  parseWiki,
  parseWeather,
  printWeather
};
