"use client";
import Card from "./_components/Card.jsx";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useRef, useState } from "react";

const SensorChart = () => {
  const ws = useRef();
  const [sensorData, setSensorData] = useState([0]);
  const [sensorData2, setSensorData2] = useState([0]);
  const [time, setTime] = useState([new Date()]);

  useEffect(() => {
    
    //Send request to our websocket server 
    ws.current = new WebSocket("ws://localhost:5000/request");

    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      //console.log(`Received message :: ${message.sensorData} ${message.sensorData2} ${message.date}`);
      setSensorData2((prevArray) => limitData(prevArray, message.sensorData2));
      setSensorData((prevArray) => limitData(prevArray, message.sensorData));
      setTime((prevArray) => limitData(prevArray, new Date(message.date)));
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

  
  return (
    <div className="p-3 my-auto h-[100vh] w-[100-vw] flex flex-col items-center justify-center bg-white text-black">
      <div className="flex flew-row justify-center items-center my-8">
        <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">Real time IOT Sensor Data Using Websockets</h1>
        {/* <Link ><h2></h2></Link> */}
      </div>
      <div className="flex justify-center items-center ">
        <div className="flex flex-wrap flew-row  items-center justify-center">
          <div>
            <Card val={sensorData2.slice(-1)} type={'Rot.'} bg={'bg-blue-100'} text={'text-[#1F51FF]'}/>
            <Card val={sensorData.slice(-1)} type={'Acc.'} bg={'bg-red-100'} text={'text-[#e60909]'}/>
          </div>
          <div className="md:h-[500px] md:w-[770px] h-96 w-96  items-center justify-center">
          <LineChart
            xAxis={[
              {
                id: 'Time',
                label: 'Time',
                data: time,
                scaleType: 'time',
                valueFormatter: (date) => date.toTimeString(),
              },
            ]}
            series={[
              {
                id: "Rotation",
                label: "Rotation",
                data: sensorData2,
                color: "#1F51FF",
              },
              {
                id: "Acceleration",
                label: "Acceleration",
                data: sensorData,
                color: "#FF1F1F",
              }
            ]}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
