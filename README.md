# homebridge-sonoff-tasmota-http

This is a plugin for [homebridge](https://github.com/nfarina/homebridge) which makes it possible to control Sonoff Basic devices with [Tasmota](https://github.com/arendst/Sonoff-Tasmota) firmware through HTTP only

# Information
```
http://sonoff/cm?cmnd=Power
http://sonoff/cm?cmnd=Power%20On
http://sonoff/cm?cmnd=Power%20Off
```

## Example config

```json
{
  "accessory": "SonoffTasmotaHTTP",
  "hostname": "The hostname of the Sonoff device"
}
```