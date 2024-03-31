"use client";
import Card from "./_components/Card.jsx";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useRef, useState } from "react";

const SensorChart = () => {
  const ws = useRef();
  const [sensorData, setSensorData] = useState([0]);

  // const dummy = [1,3,50,6,3,42,20,18,28,39,21,90,1,3,50,6,3,42,20,18,46]

  useEffect(() => {
    
    //Send request to our websocket server 
    ws.current = new WebSocket("ws://localhost:5000/request");

    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      console.log(`Received message :: ${message.sensorData}`);
      setSensorData((prevArray) => limitData(prevArray, message.sensorData));
    };
    ws.current.onclose = (ev) => {
      console.log("Client socket close!");
    };

    //We limit the number of reads to the last 20 reading and drop the last read
    function limitData(currentData, sensorData) {
      if (currentData.length > 20) {
        console.log("Limit reached, dropping first record!");
        currentData.shift();
      }
      return [
        ...currentData,
        sensorData
      ];
    }

    return () => {
      console.log("Cleaning up! ");
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    console.log("Data updated!", sensorData);
  }, [sensorData]);

  
  return (
    <div className="p-3 my-auto h-[100vh] w-[100-vw] flex flex-col items-center justify-center bg-white text-black">
      <div className="flex flew-row justify-center items-center my-8">
        <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">Real time IOT Sensor Data Using Websockets</h1>
      </div>
      <div className="flex justify-center items-center ">
        <div className="flex flex-wrap flew-row  items-center justify-center">
          <Card val={sensorData.slice(-1)} />
          <div className="md:h-[500px] md:w-[770px] h-96 w-96  items-center justify-center">
          <LineChart
            series={[
              {
                data: sensorData,
                color: "#1F51FF",
              },
            ]}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
