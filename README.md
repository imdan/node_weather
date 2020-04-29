# node_weather

![node_weather icon](./node_weather_icon.png)

> Node web scraper that console logs the current weather for a given city using coordinates from Wikipedia and weather data from weather.com.

## usage

After cloning repo, install dependencies using npm install.
```
npm install
```
Then run node weather followed by the desired city and state to get the current weather.
```
node weather city state
```
## defaults and formatting

Defaults can be set in the city and state variables in weather.js...just make sure the capitalize function is still in place or that names begin with a capital letter.

Cities and states with spaces in their name must be formatted with an underscore like below.
```
node weather new_city new_state
```
##  

Now you can get the weather from the command line...or you could just walk outside.

- version: 1.0.0
- license: SUP
- author: Dan McGuire