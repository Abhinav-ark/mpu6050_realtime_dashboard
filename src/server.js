const { createServer } = require("http");
const { parse } = require("url");
const WebSocketServer = require("ws").Server;
const {write} = require('./influxdb');

// Create the https server
const server = createServer();
// Create two instance of the websocket server
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

// Take note of client or users connected
const users = new Set();

/*For the first connection "/request" path save clients that initiated connection in our list */
wss1.on("connection", function connection(socket) {
  console.log("wss1:: User connected");
  const userRef = {
    socket: socket,
    connectionDate: Date.now(),
  };
  console.log("Adding to set");
  users.add(userRef);
});

/* For the second connection "/sendSensorData" we listen for sensor reads from the ESP32 board. Upon receiving the sensor read, we broadcast it to all the client listener */
wss2.on("connection", function connection(ws) {
  console.log("wss2:: socket connection ");
  ws.on('message', function message(data) {
      const now = Date.now();
      const parseData = JSON.parse(data);
      
      //Write the sensor data to influxdb
      write(parseData.value);
      
      let message = { date: now, sensorData: parseData.value };
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
  // console.log("message: ",message);
  for (const user of users) {
    user.socket.send(message);
  }
};

