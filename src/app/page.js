"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SensorChart = () => {
  const ws = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    
    //Send request to our websocket server 
    ws.current = new WebSocket("ws://localhost:5000/request");

    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      console.log(`Received message :: ${message.sensorData}`);
      // Upon receiving websocket message then add it to the list of data that we are displaying
      let newDataArray = [
        ...data,
        {
          id: message.date,
          sensorData: message.sensorData,
        },
      ];
      console.log(newDataArray);
      setData((currentData) => limitData(currentData, message));
    };
    ws.current.onclose = (ev) => {
      console.log("Client socket close!");
    };

    //We limit the number of reads to the last 24 reading and drop the last read
    function limitData(currentData, message) {
      if (currentData.length > 24) {
        console.log("Limit reached, dropping first record!");
        currentData.shift();
      }
      return [
        ...currentData,
        {
          id: message.date,
          sensorData: message.sensorData,
        },
      ];
    }

    return () => {
      console.log("Cleaning up! ");
      ws.current.close();
    };
  }, []);

  //Display the chart using rechart.js
  return (
    <div className="p-3 my-auto h-[100vh] w-[100-vw] items-center justify-center bg-white text-black">
      <div className="flex flew-row justify-center items-center my-8">
        <h1 className="text-xl font-bold">Real time IOT Sensor Data Using Websockets</h1>
      </div>
      <div className="flex flew-row justify-center items-center">
        <div style={{ width: 1000, height: 600 }}>
          <ResponsiveContainer>
            <LineChart
              height={400}
              width={600}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* <XAxis dataKey="data" /> */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sensorData"
                stroke="#8884d8"
                activeDot={{ r: 24 }}
                strokeWidth="4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
