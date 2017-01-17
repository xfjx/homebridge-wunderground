# homebridge-wunderground
Weather Underground plugin for homebridge: https://github.com/nfarina/homebridge

This is a very basic plugin for Nfarina's wonderfull [Homebridge project](https://github.com/nfarina/homebridge). It will fetch current weather conditions from [Weather Underground](http://wunderground.com) and provide temperature and humidity information for HomeKit.

You can look at the current weather conditions via HomeKit enabled Apps on your iOS device or even ask Siri for them.

It will get new data once per minute.

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

"accessories": [
    {
      "accessory": "WUNDERGROUND",
      "name": "Weather Underground",
      "device": "WURecklinghausen",
      "key": "xxxxxxxxxxxx",
      "city": "Germany/Recklinghausen"
      }
    ]
```
