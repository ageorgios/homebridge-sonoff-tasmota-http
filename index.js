var Service,
    Characteristic;
var request = require('request');

module.exports = function (homebridge) {
  Service        = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-sonoff-tasmota-http', 'SonoffTasmotaHTTP', SonoffTasmotaHTTPAccessory);
};

function SonoffTasmotaHTTPAccessory(log, config) {
  this.log      = log;
  this.config   = config;
  this.name     = config['name'];
  this.relay    = config['relay'] || '';
  this.hostname = config['hostname'] || 'sonoff';
  this.password = config['password'] || '';
  this.timeout  = config['timeout'] || '200';

  this.service = new Service.Outlet(this.name);

  this.service
      .getCharacteristic(Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this));

  this.log('Sonoff Tasmota HTTP Initialized');
}

SonoffTasmotaHTTPAccessory.prototype.getState = function (callback) {
  var that = this;
  request({
    uri:     'http://' + that.hostname + '/cm?user=admin&password=' + that.password + '&cmnd=Power' + that.relay,
    timeout: that.timeout,
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }
    var sonoff_reply = JSON.parse(body); // {"POWER":"ON"}
    that.log('Sonoff HTTP: ' + that.hostname + ', Relay ' + that.relay + ', Get State: ' + JSON.stringify(sonoff_reply));
    switch (sonoff_reply['POWER' + that.relay]) {
      case 'ON':
        callback(null, 1);
        break;
      case 'OFF':
        callback(null, 0);
        break;
    }
  });
};

SonoffTasmotaHTTPAccessory.prototype.setState = function (toggle, callback) {
  var newstate = '%20Off';
  if (toggle) {
    newstate = '%20On';
  }
  var that = this;
  request({
    uri:     'http://' + that.hostname + '/cm?user=admin&password=' + that.password + '&cmnd=Power' + that.relay + newstate,
    timeout: that.timeout,
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }
    var sonoff_reply = JSON.parse(body); // {"POWER":"ON"}
    that.log('Sonoff HTTP: ' + that.hostname + ', Relay ' + that.relay + ', Set State: ' + JSON.stringify(sonoff_reply));
    switch (sonoff_reply['POWER' + that.relay]) {
      case 'ON':
        callback();
        break;
      case 'OFF':
        callback();
        break;
    }
  });
};

SonoffTasmotaHTTPAccessory.prototype.getServices = function () {
  return [this.service];
};
