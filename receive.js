#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var db = require('./util/database');

// db.query('Select * from SensorData', function(err, result) {
//     if (err) throw err;
//     console.log(result);
//   });

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'sensordata';
        var queue1= 'monitoring';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, function(msg) {
                var payload=JSON.parse(msg.content.toString());
                //console.log(payload);
                //console.log(payload.temperature,payload.humidity,payload.soil_moisture,payload.pressure);
                sqlparams=[[payload.temperature,payload.humidity,payload.soil_moisture,payload.pressure]];
                //console.log(sqlparams);
                var sql = "INSERT INTO SensorData (temperature, humidity,soil_moisture,pressure) VALUES ?";
                db.query(sql,[sqlparams], function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted");
                  console.log("Received %s", msg.content.toString());
                });
                channel.assertQueue(queue1, {
                    durable: false, maxLength: 20,overflow: "drop-head"
                });
                channel.sendToQueue(queue1, Buffer.from(msg.content.toString()));

        }, {
            noAck: true
        });
    });
});