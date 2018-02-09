"use strict";
var Wunderground = require('wundergroundnode');
var Service, Characteristic;

var temperatureService;
var humidityService;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-wunderground", "WUNDERGROUND", WUTemphum);
}

function WUTemphum(log, config) {
    this.log = log;
    this.wunderground = new Wunderground(config['key']);
    this.name = config['name'];
    this.city = config['city'];
    this.WUPolling = config['polling'] || '0'; // Default is no polling.
    this.timestampOfLastUpdate = 0;
    this.weather = {};

	if (this.WUPolling > 0) {
		if (this.WUPolling < 5) this.WUPolling = 5; // Minimum polling time to not exceed 500/day.
		var that = this;
		this.WUPolling *= 60000;
		setTimeout(function() {
			that.servicePolling();
		}, this.WUPolling);
	};

	this.log.info("WUnderground Polling (minutes) is: %s", (this.WUPolling == '0') ? 'OFF' : this.WUPolling/60000);

}

WUTemphum.prototype = {

	servicePolling: function(){
		this.log.info('WUnderground Polling...');
		this.getState(function(p) {
			var that = this;
			that.log.info("WUnderground Temperature is: %s, Humidity is: %s", p.temperature, p.humidity);
			that.temperatureService.setCharacteristic(Characteristic.CurrentTemperature, p.temperature || 0);
			that.humidityService.setCharacteristic(Characteristic.CurrentRelativeHumidity, p.humidity || 0);
			setTimeout(function() {
				that.servicePolling();
			}, that.WUPolling);
		}.bind(this));
	},

    getStateHumidity: function(callback){
        this.getState(function(w) {
            callback(null, w.humidity || 0);
        });
    },

    getStateTemperature: function(callback){
        this.getState(function(w) {
            callback(null, w.temperature || 0);
        });
    },

    getState: function (callback) {
    	// Only fetch new data once every 3 minutes max
    	var that = this;
    	if (this.timestampOfLastUpdate + 180 > (Date.now() / 1000 | 0)){
            callback(that.weather)
            return;
        }

        that.timestampOfLastUpdate = Date.now() / 1000 | 0;

        that.wunderground.conditions().request(that.city, function(err, response){
            if (!err && response['current_observation'] && response['current_observation']['temp_c']) {
                that.log('Successfully fetched weather data from wunderground.com');
                that.temperatureService.setCharacteristic(Characteristic.StatusFault,0);
                that.humidityService.setCharacteristic(Characteristic.StatusFault,0);
                that.weather.temperature = response['current_observation']['temp_c'];
                that.weather.humidity = parseFloat(response['current_observation']['relative_humidity']);
                callback(that.weather);
            }
            else {
                that.log("Error fetching weather data from wunderground.com! Check your connection or configuration.");
                that.temperatureService.setCharacteristic(Characteristic.StatusFault,1);
                that.humidityService.setCharacteristic(Characteristic.StatusFault,1);
                if (err) {
                  that.log(err);
                } else if (response['response']['error'] && response['response']['error']['type'] && response['response']['error']['description']) {
                  that.log(response['response']['error']['type'] + " : " + response['response']['error']['description']);
                }
                callback(that.weather);
            }
        });
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var services = []
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "HomeBridge")
                .setCharacteristic(Characteristic.Model, "Weather Underground")
                .setCharacteristic(Characteristic.SerialNumber, this.city);
		services.push(informationService);

        this.temperatureService = new Service.TemperatureSensor(this.name);
        this.temperatureService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getStateTemperature.bind(this));

        this.temperatureService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .setProps({minValue: -50});

        this.temperatureService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .setProps({maxValue: 50});
		services.push(this.temperatureService);

        this.humidityService = new Service.HumiditySensor(this.name);
        this.humidityService
                .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                .on('get', this.getStateHumidity.bind(this));
		services.push(this.humidityService);

        return services;
    }
};

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
