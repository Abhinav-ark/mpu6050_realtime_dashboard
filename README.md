<h1 align="center">Real Time Dashboard for MPU6050 Accelerometer/Gyroscope</h1>

This is a real time Dashboard for Graphical representation of real time Acceleration and Rotation data from MPU6050 using websockets and also recorder Time series sensor data using InfluxDB.

## Technologies Used
- [x] `Arduino ESP32`
- [x] `Adafruit`
- [x] `Embedded C`
- [x] `WebSockets`
- [x] `InfluxDB`
- [x] `NodeJS`
- [x] `React`
- [x] `NextJS`
- [x] `Express`
- [x] `MUI React`

<br>

<h2 align="center"> UI Screens </h2>

## Real Time Data (Last 20 Readings)
<img src="./Assets/realTime.png" align="center"></img>

<br>

## All Time Data
<img src="./Assets/allTime.png" align="center"></img>

<br>

<h2 align="center"> How to setup ? </h2>

- Connect the MPU6050 Sensor to the `ESP32 Microcontroller` and connect the Microcontroller to your computer through a USB Cable.

<div align="center">
    <img src="./Assets/circuit.webp" width="500px"/>
</div>

- Install All the libraries in Arduino IDE
  - [ArduinoWebockets](https://github.com/gilmaimon/ArduinoWebsockets)
  - [Adafruit_MPU6050](https://github.com/adafruit/Adafruit_MPU6050)
  - [WiFi](https://www.arduino.cc/reference/en/libraries/wifi/)
  - [Wire](https://www.arduino.cc/reference/en/language/functions/communication/wire/)
- Enter the Wifi Network SSID, PASSWORD, IP Address of the Server Computer in which your Backend is Running in The `mpu6050.ino` Arduino File and Upload the code to the board.

<div align="center">
    <img src="./Assets/WiFi.png" width="700px"/>
</div>

> [!IMPORTANT]  
> It is necessary that both the `ESP32 Microcontroller` and the backend server are connected to the same WiFi Network for the Code to work.

- In the Server Computer, make sure you have [`nodeJS`](https://nodejs.org/en/download) installed.
- Goto the backend folder and type the following commands to install the dependencies.
```bash
> npm install
```
- To run the development server type the following command
```bash
> npm run dev
```
