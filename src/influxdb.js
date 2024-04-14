require('dotenv').config('.env');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

/** Environment variables **/
const url = process.env.URL
const token = process.env.API_TOKEN
const org = process.env.ORG
const bucket = process.env.BUCKET
const dataType = process.env.DATA_TYPE
const sensorId = process.env.SENSOR_ID

const influxDB = new InfluxDB({ url, token })

const write = (value) => {

    const writeApi = influxDB.getWriteApi(org, bucket)

    writeApi.useDefaultTags({ region: 'south' })
    
    const point1 = new Point(dataType)
    .tag('sensor_id', sensorId)
    .floatField('value', value);
    
    console.log(` ${point1}`)

    writeApi.writePoint(point1)

    writeApi.close().then(() => {
    console.log('WRITE FINISHED')
    })  
}

module.exports = {write};