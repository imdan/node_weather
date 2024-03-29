const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.resolve(__dirname, `${process.env.DB_PATH}`));


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

const saveWeather = (weather) => {
  // saves weather to sqlite db
  // console.log(`db path ${process.env.DB_PATH}`);

  if (!weather) {
    console.log('\nweather not saved.');
    return false;
  }

  // console.log(path.resolve('/home/dan/Documents/apps/node_weather', `${process.env.DB_PATH}`));

  const { temp, desc, feels, location, prec, time } = weather;
  const today = new Date().toLocaleDateString();

  try {
    db.serialize(() => {
      const stmt = db.prepare("INSERT INTO weather(date, time, temp, desc, feels, location, prec) VALUES (?,?,?,?,?,?,?)");
      stmt.run(`${today}`, `${time}`, `${temp}`, `${desc}`, `${feels}`, `${location}`, `${prec}`);
      stmt.finalize();
      console.log('weather saved.\n')
    });
    
    db.close()

  } catch (err) {
    console.log('db error, weather not saved\n')
    return false
  }

}

module.exports = {
  capitalizeArgs,
  parseArgs,
  printWeather,
  saveWeather
};
