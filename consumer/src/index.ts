import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "producer",
    brokers: [process.env['KAFKA_BROKERCONNECT'] as string],
});


const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env['KAFKA_TOPIC'] as string, fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Received: ", {
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
  };

  run().catch(console.error);