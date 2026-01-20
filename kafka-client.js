import 'dotenv/config';
import { Kafka } from 'kafkajs';
import fs from 'node:fs';


//  aplicacao de credenciais
export const kafka = new Kafka({
  clientId: 'monitor-geofence-client',
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    rejectUnauthorized: false,
    ca: [fs.readFileSync(process.env.CA_PATH)],
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
  },
});