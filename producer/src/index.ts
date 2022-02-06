import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "producer",
    brokers: [process.env['KAFKA_BROKERCONNECT'] as string],
});

const producer = kafka.producer({
    maxInFlightRequests: 1,
    idempotent: true,
    transactionalId: "my-producer-id",
});

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function sendPayload(input: string) {
    try {
        await producer.send({
            topic: process.env['KAFKA_TOPIC'] as string,
            messages: [{ key: "test", value: input }],
        });
        await console.log("Sent: " + input);
        await sleep(1000);
    } catch (e) {
        console.error("Caught Error while sending:", e);
    }
}

async function main() {
    await producer.connect();
    var i: number = 0
    while (true) {
        try {
            await sendPayload(i.toString());
        } catch (e) {
            console.error(e);
        }
        i++;
    }
}

main();