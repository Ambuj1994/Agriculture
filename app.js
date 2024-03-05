const express= require('express');
const {sendDataToQueue,consumeDatafromQueue} = require('./util/rabbitmq'); // Assuming you saved the above script as 'rabbitmq.js'
var db = require('./util/database');

const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.json());

//const data = { message: "Hello, RabbitMQ!" };
const queueName = 'sensordata';
const consumequeue='monitoring';

// Use sendDataToQueue function

async function handleMessage(data) {
  // Process the message here
  console.log('Received message:', data);
}


app.post('/sensordata',(req,res,next)=>{
    console.log(req.body.temperature);
    let data={temperature:req.body.temperature,humidity:req.body.humidity,soil_moisture:req.body.soil_moisture,pressure:req.body.pressure};
    sendDataToQueue(queueName, data);
    res.send("postsent");
})

app.use((req,res,next)=>
{
// console.log("test");
// db.query('Select * from SensorData', function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     res.json(result);
//   });
consumeDatafromQueue(consumequeue,handleMessage);
res.send("getsent");
})

app.listen(3000);