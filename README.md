# node_weather

![node_weather icon](./node_weather_icon.png)

> Node web scraper that logs the current weather for a given city using coordinates from Wikipedia and weather data from weather.com.

## usage

After cloning repo, install globally using the command below, with local_dir_path being the directory you cloned it to. (`./` if you're in the directory)

```
npm install -g local_dir_path
```

Once installed, you can now run the `weather` command from anywhere in the command line followed by the desired city and state to get the current weather.

```
weather city state
```

## defaults and formatting

If no arguments are passed in, the current default is Chicago, Illinois, but this can be changed by setting the default city and state in /bin/index.js. Just make sure the capitalize function is still in place or that the names begin with a capital letter.

Cities and states with spaces in their name must be formatted with an underscore like below.

```
weather new_city new_state
```

##

Now you can get the weather from the command line...or you could just walk outside.

- version: 2.0.0
- license: MIT
- author: Dan McGuire
