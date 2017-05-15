# homebridge-wunderground
Weather Underground plugin for homebridge: https://github.com/nfarina/homebridge

This is a very basic plugin for Nfarina's wonderfull [Homebridge project](https://github.com/nfarina/homebridge). It will fetch current weather conditions from [Weather Underground](http://wunderground.com) and provide temperature and humidity information for HomeKit.

You can look at the current weather conditions via HomeKit enabled Apps on your iOS device or even ask Siri for them.

It will retrieve new data no more than 3 time per minute. Polling is also now optional by setting the polling (minutes) parameter in the config.json. Polling happens in the background, defaults to 0 (OFF), and must be at least 5 minutes so as not to exceed the 500 daily maximum calls to WeatherUnderground (Developer service).

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-wunderground
3. Update your configuration file. See the sample below.

All you need now is a developer key for Weather Underground which can be easily created [here](http://www.wunderground.com/weather/api/).

# Configuration

Configuration sample:

 ```
Add the following information to your config file.
Make sure to add your API key and provice your city or postal code.

You can also provide a PWS-ID instead. Just use something like "city":"pws:XYZ1"
Make sure to replace any blanks in your city name by underscores ('_').
Polling is optional and defaults to 0 (OFF).

"accessories": [
    {
      "accessory": "WUNDERGROUND",
      "name": "Weather Underground",
      "device": "WURecklinghausen",
      "key": "xxxxxxxxxxxx",
      "city": "Germany/Recklinghausen",
	  "polling": "10"
      }
    ]
```
