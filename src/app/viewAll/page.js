"use client";
import { LineChart } from "@mui/x-charts";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const buttonStyle = {
  color: 'white',
  backgroundColor: 'black',
};

const SensorChart = () => {
  const ws = useRef();
  
  //rotation data
  const [sensorData1, setSensorData1] = useState([]);
  const [sensorData2, setSensorData2] = useState([]);
  const [sensorData3, setSensorData3] = useState([]);
  
  //acceleration data
  const [sensorData4, setSensorData4] = useState([]);
  const [sensorData5, setSensorData5] = useState([]);
  const [sensorData6, setSensorData6] = useState([]);
  
  //time data
  const [time, setTime] = useState([]);

  const organizeData = (data) => {
        let timeDict = [];

        data.forEach((item) => {
            let time = item._time;
            let field = item._field;
            let value = item._value;

            if (!timeDict[time]) {
                timeDict[time] = {};
            }

            timeDict[time][field] = value;
        });

        let time = [];
        let rotX = [];
        let rotY = [];
        let rotZ = [];
        let accX = [];
        let accY = [];
        let accZ = [];

      for (let key in timeDict) {
          time.push(new Date(key));
          rotX.push(timeDict[key].RotX);
          rotY.push(timeDict[key].RotY);
          rotZ.push(timeDict[key].RotZ);
          accX.push(timeDict[key].AccX);
          accY.push(timeDict[key].AccY);
          accZ.push(timeDict[key].AccZ);
      }

      
        for (let i = 0; i < time.length; i++) {
            for (let j = i + 1; j < time.length; j++) {
                if (time[i] > time[j]) {
                    let temp = time[i];
                    time[i] = time[j];
                    time[j] = temp;
              
                    temp = rotX[i];
                    rotX[i] = rotX[j];
                    rotX[j] = temp;

                    temp = rotY[i];
                    rotY[i] = rotY[j];
                    rotY[j] = temp;

                    temp = rotZ[i];
                    rotZ[i] = rotZ[j];
                    rotZ[j] = temp;

                    temp = accX[i];
                    accX[i] = accX[j];
                    accX[j] = temp;

                    temp = accY[i];
                    accY[i] = accY[j];
                    accY[j] = temp;

                    temp = accZ[i];
                    accZ[i] = accZ[j];
                    accZ[j] = temp;    
                }
            }
        }

        setTime(time);
        setSensorData1(rotX);
        setSensorData2(rotY);
        setSensorData3(rotZ);
        setSensorData4(accX);
        setSensorData5(accY);
        setSensorData6(accZ);
        console.log(time, rotX, rotY, rotZ, accX, accY, accZ);
  }

  useEffect(() => {
      const fetchData = async () => {
      try {
          const response = await fetch("http://localhost:5001/getData", {
              headers: {
                  "Content-Type": "application/json"
              },
              method: "GET"
          });

          if (response.ok) {
              const data = await response.json();
              organizeData(data);
          } else {
              console.error('Failed to fetch data:', response.statusText);
          }
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
      //console.log(sensorData, sensorData2, time);
  }, []);

  
  return (
    <div className="p-3 my-auto  flex flex-col items-center justify-center bg-white text-black">
      <div className="absolute top-2 flex flex-col items-center ">
        <div className="flex flew-row justify-center items-center mt-8 mb-2">
          <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">All time MPU6050 Sensor Data</h1>
        </div>
        <div className="justify-center items-center mt-5"> 
          <Link href="./">
          <Button variant="contained" style={buttonStyle} endIcon={<AccessTimeIcon/>} >
            Real Time
          </Button>
          </Link>
        </div> 
      </div>
      <div className="flex justify-center items-center h-[100vh] w-[100-vw]">
        <div className="flex flex-wrap flew-row pt-20 items-center justify-center">
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
