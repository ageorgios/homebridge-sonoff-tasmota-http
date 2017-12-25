var Service, Characteristic;
var request = require('request');

function isSonoffOn(http_reply) {
  
}

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-sonoff-tasmota-http", "SonoffTasmotaHTTP", SonoffTasmotaHTTPAccessory);
}

function SonoffTasmotaHTTPAccessory(log, config) {
  this.log = log;
  this.config = config;
  this.name = config["name"]
  this.hostname = config["hostname"] || "sonoff";
  
  this.service = new Service.Outlet(this.name);
  
  this.service
  .getCharacteristic(Characteristic.On)
  .on('get', this.getState.bind(this))
  .on('set', this.setState.bind(this));
  
  this.log("Sonoff Tasmota HTTP Initialized")
}

SonoffTasmotaHTTPAccessory.prototype.getState = function(callback) {
  var that = this
  request("http://" + that.hostname + "/cm?cmnd=Power", function(error, response, body) {
    if (error) return callback(error);
    var sonoff_reply = JSON.parse(body); // {"POWER":"ON"}
    that.log("Sonoff HTTP: " + that.hostname + " Get State: " + JSON.stringify(sonoff_reply));
    switch (sonoff_reply["POWER"]) {
      case "ON":
        callback(null, 1);
        break;
      case "OFF":
        callback(null, 0);
        break;
    }
  })
}

SonoffTasmotaHTTPAccessory.prototype.setState = function(toggle, callback) {
  var newstate = "%20Off"
  if (toggle) newstate = "%20On"
  var that = this
  request("http://" + that.hostname + "/cm?cmnd=Power" + newstate, function(error, response, body) {
    if (error) return callback(error);
    var sonoff_reply = JSON.parse(body); // {"POWER":"ON"}
    that.log("Sonoff HTTP: " + that.hostname + " State: " + JSON.stringify(sonoff_reply));
    switch (sonoff_reply["POWER"]) {
      case "ON":
        callback();
        break;
      case "OFF":
        callback();
        break;
    }
  })
}

SonoffTasmotaHTTPAccessory.prototype.getServices = function() {
  return [this.service];
}
