"use client";
import Card from "./_components/Card.jsx";
import { LineChart } from "@mui/x-charts";
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link.js";

const SensorChart = () => {
  const ws = useRef();
  const [sensorData1, setSensorData1] = useState([0]);
  const [sensorData2, setSensorData2] = useState([0]);
  const [sensorData3, setSensorData3] = useState([0]);
  const [sensorData4, setSensorData4] = useState([0]);
  const [sensorData5, setSensorData5] = useState([0]);
  const [sensorData6, setSensorData6] = useState([0]);
  const [time, setTime] = useState([new Date()]);

  useEffect(() => {
    
    //Send request to our websocket server 
    ws.current = new WebSocket("ws://localhost:5000/request");

    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      //console.log(`Received message :: ${message.sensorData1} ${message.sensorData2} ${message.date}`);
      setSensorData1((prevArray) => limitData(prevArray, message.sensorData1));
      setSensorData2((prevArray) => limitData(prevArray, message.sensorData2));
      setSensorData3((prevArray) => limitData(prevArray, message.sensorData3));
      setSensorData4((prevArray) => limitData(prevArray, message.sensorData4));
      setSensorData5((prevArray) => limitData(prevArray, message.sensorData5));
      setSensorData6((prevArray) => limitData(prevArray, message.sensorData6));
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
    <div className="relative p-3 my-auto  flex flex-col items-center justify-center bg-white text-black">
      <div className="absolute top-2 flex flex-col items-center ">
        <div className="flex flew-row justify-center items-center mt-8 mb-2">
          <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">Real time IOT Sensor Data Using Websockets</h1>
        </div>
        <div className="justify-center items-center"> 
          <Link href="./viewAll">
          <Button variant="contained" endIcon={<SendIcon />} >
            All Data
          </Button>
          </Link>
        </div> 
      </div>
      <div className="flex justify-center items-center h-[100vh] w-[100-vw]">
        <div className="flex flex-wrap flew-row  items-center justify-center">
          <div>
            <Card val={sensorData1.slice(-1)} type={'Rot.X'} bg={'bg-blue-100'} text={'text-[#1F51FF]'}/>
            <Card val={sensorData2.slice(-1)} type={'Rot.Y'} bg={'bg-red-100'} text={'text-[#e60909]'}/>
            <Card val={sensorData3.slice(-1)} type={'Rot.Z'} bg={'bg-green-100'} text={'text-[#1e522c]'}/>
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
                id: "Rotation X",
                label: "Rotation X",
                data: sensorData1,
                color: "#1F51FF",
              },
              {
                id: "Rotation Y",
                label: "Rotation Y",
                data: sensorData2,
                color: "#FF1F1F",
              },
              {
                id: "Rotation Z",
                label: "Rotation Z",
                data: sensorData3,
                color: "#036e20",
              }
            ]}
          />
          </div>
        </div>
      </div>

      {/* Space */}
      
      <div className="flex justify-center items-center h-[100vh] w-[100-vw]">
        <div className="flex flex-wrap flew-row  items-center justify-center">
          <div>
            <Card val={sensorData4.slice(-1)} type={'Acc.X'} bg={'bg-blue-100'} text={'text-[#1F51FF]'}/>
            <Card val={sensorData5.slice(-1)} type={'Acc.Y'} bg={'bg-red-100'} text={'text-[#e60909]'}/>
            <Card val={sensorData6.slice(-1)} type={'Acc.Z'} bg={'bg-green-100'} text={'text-[#1e522c]'}/>
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
                id: "Acceleration X",
                label: "Acceleration X",
                data: sensorData4,
                color: "#1F51FF",
              },
              {
                id: "Acceleration Y",
                label: "Acceleration Y",
                data: sensorData5,
                color: "#FF1F1F",
              },
              {
                id: "Acceleration Z",
                label: "Acceleration Z",
                data: sensorData6,
                color: "#036e20",
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
