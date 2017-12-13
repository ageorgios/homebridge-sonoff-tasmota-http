var Service, Characteristic;
var request = require('request');


module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-sonoff-tasmota-http", "SonoffTasmotaHTTP", SonoffTasmotaHTTPAccessory);
}

function SonoffTasmotaHTTPAccessory(log, config) {
  this.log = log;
  this.config = config;
  this.name = config["name"]
  this.relay = config["relay"] || ""
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
  request("http://" + that.hostname + "/cm?cmnd=Power" + that.relay, function(error, response, body) {
    if (error) return callback(error);
  	var lines = body.split("\n");
  	that.log("Sonoff HTTP: " + that.hostname + ", Relay " + that.relay + ", Get State: " + lines[1]);
  	if (lines[1] == "POWER" + that.relay + " = OFF") callback(null, 0)
  	else if (lines[1] == "POWER" + that.relay + " = ON") callback(null, 1)
  })
}

SonoffTasmotaHTTPAccessory.prototype.setState = function(toggle, callback) {
  var newstate = "%20Off"
  if (toggle) newstate = "%20On"
  var that = this
  request("http://" + that.hostname + "/cm?cmnd=Power" + that.relay + newstate, function(error, response, body) {
    if (error) return callback(error);
  	var lines = body.split("\n");
  	that.log("Sonoff HTTP: " + that.hostname + ", Relay " + that.relay + ", Set State to: " + lines[1]);
  	if (lines[1] == "POWER" + that.relay + " = OFF") callback()
  	else if (lines[1] == "POWER" + that.relay + " = ON") callback()
  })
}

SonoffTasmotaHTTPAccessory.prototype.getServices = function() {
  return [this.service];
}
