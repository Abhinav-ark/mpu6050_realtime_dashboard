require('dotenv').config('.env');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Environment variables
const url = process.env.URL
const token = process.env.API_TOKEN
const org = process.env.ORG
const bucket = process.env.BUCKET
const dataType = process.env.DATA_TYPE
const sensorId = process.env.SENSOR_ID

const influxDB = new InfluxDB({ url, token })

const write = (value1,value2,value3,value4,value5,value6,now) => {

    const writeApi = influxDB.getWriteApi(org, bucket)

    writeApi.useDefaultTags({ region: 'south' })
    
    const point1 = new Point(dataType)
    .tag('sensor_id', sensorId)
    .timestamp(now)
    .floatField('AccX', parseFloat(value4))
    .floatField('AccY', parseFloat(value5))
    .floatField('AccZ', parseFloat(value6))
    .floatField('RotX', parseFloat(value1))
    .floatField('RotY', parseFloat(value2))
    .floatField('RotZ', parseFloat(value3));
    
    //console.log(`${point1}`)

    writeApi.writePoint(point1)

    writeApi.close().then(() => {
    console.log('WRITE FINISHED')
    })  
}

const read = async () => {
    const queryApi = influxDB.getQueryApi(org)
    const query = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "sensor_data" and r.sensor_id == "MPU6050" and (r._field == "AccX" or r._field == "AccY" or r._field == "AccZ" or r._field == "RotX" or r._field == "RotY" or r._field == "RotZ"))`
    const result = await queryApi.collectRows(query)
    //console.log(result)
    return result
}



module.exports = {write,read};