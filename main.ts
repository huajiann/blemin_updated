function SEND (pin: string, value: string) {
    esp8266.writeBlynk(token, pin, value)
    if (esp8266.isBlynkUpdated()) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
    basic.showIcon(IconNames.SmallDiamond)
}
function sendSoil () {
    basic.showLeds(`
        . # # # #
        # . . . .
        . # # # .
        . . . . #
        # # # # .
        `)
    basic.pause(1000)
    soil = pins.analogReadPin(AnalogPin.P2)
    SEND("V3", convertToText(soil))
    basic.showString(":" + soil)
    basic.pause(500)
}
function sendTemp () {
    basic.showLeds(`
        # # # # #
        . . # . .
        . . # . .
        . . # . .
        . . # . .
        `)
    basic.pause(1000)
    air_temperature = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P15)
    SEND("V1", convertToText(air_temperature))
    basic.showString(":" + air_temperature)
    basic.pause(500)
}
function triggerr (value: string) {
    if (value == "F") {
        pins.digitalWritePin(DigitalPin.P0, 1)
        basic.pause(5000)
        pins.digitalWritePin(DigitalPin.P0, 0)
    } else if (value == "F") {
        pins.digitalWritePin(DigitalPin.P1, 1)
        basic.pause(5000)
        pins.digitalWritePin(DigitalPin.P1, 0)
    } else if (value == "Fo") {
        motorbit.freestyle(50, 50)
    } else if (value == "S") {
        motorbit.brake()
    }
}
function sendHumid () {
    basic.showLeds(`
        # . . . #
        # . . . #
        # # # # #
        # . . . #
        # . . . #
        `)
    basic.pause(1000)
    air_humidity = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P15)
    SEND("V2", convertToText(air_humidity))
    basic.showString(":" + air_humidity)
    basic.pause(500)
}
let air_humidity = 0
let air_temperature = 0
let soil = 0
let token = ""
basic.showIcon(IconNames.Heart)
token = "hKH8amXL9oaS2ceyh289Ur3bJgGy5nS_"
esp8266.init(SerialPin.P14, SerialPin.P13, BaudRate.BaudRate115200)
esp8266.connectWiFi("A71", "Robowis7332")
if (esp8266.isWifiConnected()) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
}
basic.forever(function () {
    basic.pause(5000)
    sendTemp()
    sendHumid()
    sendSoil()
})
basic.forever(function () {
    if (esp8266.readBlynk(token, "V0") == "1") {
        pins.digitalWritePin(DigitalPin.P0, 1)
    } else {
        if (esp8266.readBlynk(token, "V0") == "0") {
            pins.digitalWritePin(DigitalPin.P0, 0)
        }
    }
    if (esp8266.readBlynk(token, "V4") == "1") {
        pins.digitalWritePin(DigitalPin.P1, 1)
    } else {
        if (esp8266.readBlynk(token, "V4") == "0") {
            pins.digitalWritePin(DigitalPin.P1, 0)
        }
    }
})
