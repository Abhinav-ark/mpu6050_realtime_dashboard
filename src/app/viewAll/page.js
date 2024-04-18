"use client";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";


export default function SensorChart() {
    const [sensorData, setSensorData] = useState([]);
    const [sensorData2, setSensorData2] = useState([]);
    const [time, setTime] = useState([]);

    const organizeData = (data) => {
        let timeDict = [];
        // [{time: {pressure: value, temperature: value}]

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
        let pressureData = [];
        let temperatureData = [];

        for (let key in timeDict) {
            time.push(new Date(key));
            pressureData.push(timeDict[key].pressure);
            temperatureData.push(timeDict[key].temperature);
        }

        
        for (let i = 0; i < time.length; i++) {
            for (let j = i + 1; j < time.length; j++) {
                if (time[i] > time[j]) {
                    let temp = time[i];
                    time[i] = time[j];
                    time[j] = temp;

                    temp = pressureData[i];
                    pressureData[i] = pressureData[j];
                    pressureData[j] = temp;

                    temp = temperatureData[i];
                    temperatureData[i] = temperatureData[j];
                    temperatureData[j] = temp;
                }
            }
        }

        setTime(time);
        setSensorData(temperatureData);
        setSensorData2(pressureData);
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
        <div className="p-3 my-auto h-[100vh] w-[100-vw] flex flex-col items-center justify-center bg-white text-black">
            <div className="flex flew-row justify-center items-center my-8">
                <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">Real time IOT Sensor Data Using Websockets</h1>
            </div>
            <div className="flex justify-center items-center ">
                <div className="flex flex-wrap flew-row  items-center justify-center">
                    <div>
                    </div>
                    <div className="md:h-[500px] md:w-[770px] h-96 w-96  items-center justify-center">
                        {time && sensorData && sensorData2 && time.length > 0 && sensorData.length > 0 && sensorData2.length > 0 ? (<LineChart
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
                                    id: "Pressure",
                                    label: "Pressure KPa",
                                    data: sensorData2,
                                    color: "#1F51FF",
                                },
                                {
                                    id: "Temperature",
                                    label: "Temperature",
                                    data: sensorData,
                                    color: "#FF1F1F",
                                }
                            ]}
                        />) : (
                            <div className="flex flex-row justify-center items-center">
                                <h1 className="text-xl font-bold text-center md:text-4xl drop-shadow-xl">Loading...</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
