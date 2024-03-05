
const amqp = require('amqplib');

let connection = null;
let channel = null;

async function connectToRabbitMQ(url) {
    try {
        connection = await amqp.connect(url);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error.message);
        throw error;
    }
}

async function sendDataToQueue(queueName, data) {
    try {
        if (!channel) {
            await connectToRabbitMQ(process.env.RABBITMQ_URL || 'amqp://localhost');
        }

        await channel.assertQueue(queueName, { durable: false });
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        console.log("Sent data to queue:", data);
    } catch (error) {
        console.error("Error sending data to RabbitMQ:", error.message);
        throw error;
    }
}

async function consumeDatafromQueue(queueName,handleMessage) {
    try {
        if (!channel) {
            await connectToRabbitMQ(process.env.RABBITMQ_URL || 'amqp://localhost');
        }

        channel.consume(queueName, async (message) => {
            if (message !== null) {
                try {
                    const data = JSON.parse(message.content.toString());
                    await handleMessage(data);
                    //console.log(`Processed message: ${JSON.stringify(data)}`);
                } catch (error) {
                    console.error('Error processing message:', error);
                } finally {
                    // Acknowledge the message
                    channel.ack(message);
                }
            }
        });
    } catch (error) {
        console.error("Error sending data to RabbitMQ:", error.message);
        throw error;
    }
}

// Ensure connection to RabbitMQ
async function initializeRabbitMQ(url) {
    try {
        await connectToRabbitMQ(url);
    } catch (error) {
        console.error("Failed to initialize RabbitMQ:", error.message);
    }
}

// Initialize RabbitMQ connection
initializeRabbitMQ(process.env.RABBITMQ_URL || 'amqp://localhost');

module.exports = {sendDataToQueue,consumeDatafromQueue};


// const amqp = require('amqplib');

// let connection = null;
// let channel = null;

// async function connectToRabbitMQ(url) {
//     try {
//         connection = await amqp.connect(url);
//         channel = await connection.createChannel();
//         console.log("Connected to RabbitMQ");
//     } catch (error) {
//         console.error("Error connecting to RabbitMQ:", error.message);
//         throw error;
//     }
// }

// async function sendDataToQueue(queueName, data) {
//     try {
//         if (!channel) {
//             await connectToRabbitMQ(process.env.RABBITMQ_URL || 'amqp://localhost');
//         }

//         await channel.assertQueue(queueName, { durable: false });
//         await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
//         console.log("Sent data to queue:", data);
//     } catch (error) {
//         console.error("Error sending data to RabbitMQ:", error.message);
//         throw error;
//     }
// }

// // Ensure connection to RabbitMQ
// async function initializeRabbitMQ(url) {
//     try {
//         await connectToRabbitMQ(url);
//     } catch (error) {
//         console.error("Failed to initialize RabbitMQ:", error.message);
//     }
// }

// // Initialize RabbitMQ connection
// initializeRabbitMQ(process.env.RABBITMQ_URL || 'amqp://localhost');

// module.exports = sendDataToQueue;
