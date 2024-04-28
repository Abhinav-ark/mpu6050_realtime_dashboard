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


<h1 align="center"> UI Screens </h1>

## Real Time Data (Last 20 Readings)
<img src="./Assets/realTime.png" align="center"></img>

<br>

## All Time Data
<img src="./Assets/allTime.png" align="center"></img>

<br>

## Video Demo
https://github.com/Abhinav-ark/mpu6050_realtime_dashboard/assets/76396917/3185790a-775a-461d-84f0-339fe4695947

<br>

<h1 align="center"> How to setup ? </h1>

## Arduino
- Connect the MPU6050 Sensor to the `ESP32 Microcontroller` and connect the Microcontroller to your computer through a USB Cable.

<br>

<div align="center">
    <b>Circuit Diagram</b> (Image Courtesy: ElectronicWings.com)
    <br>
    <img src="./Assets/circuit.webp" width="500px"/>
    <br>
    <b>DOIT ESP32 DevKit</b>
    <br>
    <img src="./Assets/Board.jpg" width="800px"/>
</div>

<br>
<br>

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

<br>

## Influx DB
- Install [`InfluxDB`](https://www.influxdata.com/downloads/) on your Server Computer (OR) you can use the cloud version also instead.
- Create a user, organisation of your choice and a Bucket named `IOT`.

<br>

## NodeJS
- In the Server Computer, make sure you have [`nodeJS`](https://nodejs.org/en/download) installed.
- Goto the backend folder and type the following commands to install the dependencies.
```bash
> npm install
```
- Goto the .env file to enter your Environmental Variables, i.e, `INFLUX DB API TOKEN`, `INFLUX DB URL` and `INFLUX DB ORGANISATION`.

<div align="center">
    <img src="./Assets/env.png" width="500px"/>
</div>

- To run the development server type the following command
```bash
> npm run dev
```
- You can test the websockets server by using the `./TestWebsockets/test.html` document.
