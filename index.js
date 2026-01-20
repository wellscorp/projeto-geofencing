import 'dotenv/config';
import fs from 'node:fs';
import { kafka } from './kafka-client.js';
import { processMov } from './geofence-service.js';

// carrega as areas
const geoAreas = new Map();
try {
    const geoData = JSON.parse(fs.readFileSync(process.env.GEOJSON_PATH, 'utf-8'));
    geoData.features.forEach(f => {
        // procura o ID na raiz ou em properties 
        const id = f.identifier || (f.properties && f.properties.identifier);
        if (id) geoAreas.set(id, f);
    });
    console.log(`[SISTEMA] ${geoAreas.size} áreas carregadas com sucesso!`);
} catch (err) {
    console.error("Erro ao carregar GeoJSON : ", err.message);
    process.exit(1);
}

async function start() {
    // conecta com o kafka
    const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });
    await consumer.connect();
    await consumer.subscribe({ 
        topic: process.env.KAFKA_TOPIC, 
        fromBeginning: false 
    }); 

    console.log("Aguardando telemetria do Kafka...");
    
    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const telemetry = JSON.parse(message.value.toString()); 
                processMov(telemetry, geoAreas);
            } catch (e) {
                console.error("Erro ao processar mensagem : ", e.message);
            }
        },
    });
}

start().catch(console.error);