const { createServer } = require("http");
const { parse } = require("url");
const WebSocketServer = require("ws").Server;
const {write, read} = require('./influxdb');
const express = require("express");
const cors = require("cors");

const app = express();

app.listen(5001);

app.use(cors());

app.get('/getData', async (req, res) => {
  try {
    const data = await read();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({'Error':'Error fetching data'});
  }
});


// Create the http server
const server = createServer();

// Create two instance of the websocket server
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

// Take note of client or users connected
const users = new Set();


// For the first connection "/request" path save clients that initiated connection in our list 
wss1.on("connection", function connection(socket) {
  console.log("wss1:: User connected");
  const userRef = {
    socket: socket,
    connectionDate: Date.now(),
  };
  console.log("Adding to set");
  users.add(userRef);
});

// For the second connection "/sendSensorData" we listen for sensor reads from the ESP32 board. Upon receiving the sensor read, we broadcast it to all the client listener 
wss2.on("connection", function connection(ws) {
  console.log("wss2:: socket connection ");
  ws.on('message', function message(data) {
      const now = new Date();
      const parseData = JSON.parse(data);
      
      //Write the sensor data to influxdb
      write(parseData.value1,parseData.value2,parseData.value3,parseData.value4,parseData.value5,parseData.value6,now);
      
      //Broadcast the sensor data to all the clients
      let message = {date: now, sensorData1: parseData.value1, sensorData2: parseData.value2, sensorData3: parseData.value3, sensorData4: parseData.value4, sensorData5: parseData.value5, sensorData6: parseData.value6};
      const jsonMessage = JSON.stringify(message);
      sendMessage(jsonMessage);
  });
});


/*
Initial connection is on HTTP but is upgraded to websockets
The two paths "/request" and "/sendSensorData" are defined here
*/
server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);
  console.log(`Path name ${pathname}`);

  if (pathname === "/request") {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit("connection", ws, request);
    });
  } else if (pathname === "/sendSensorData") {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});


//Open the server port in 5000
server.listen(5000);


//function to send websocket messages to user
const sendMessage = (message) => {
  for (const user of users) {
    user.socket.send(message);
  }
};

