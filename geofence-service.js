import * as turf from '@turf/turf';
import fs from 'node:fs';

const deviceStates = new Map();

export function processMov(telemetry, geoAreas) {
    const { identifier, latitude, longitude, device_id } = telemetry;
    const areaFeature = geoAreas.get(identifier);


    if (!areaFeature) return;
    const areaName = areaFeature.properties.area_name;

    const point = turf.point([longitude, latitude]);
    const isInsideNow = turf.booleanPointInPolygon(point, areaFeature.geometry);
    const currentStatus = isInsideNow ? 'INSIDE' : 'OUTSIDE';

    const prevState = deviceStates.get(identifier);

    // log para cada mensagem processada 
    console.log(`[EVENT] Device: ${identifier} | Status : ${currentStatus}`);

    // deteccao de transicao
    if (prevState && prevState.status !== currentStatus) {
        const duration = (Date.now() - prevState.timestamp) / 1000;
        
        // escrita no CSV | na transicao
        // colunas: tempo, identificador, nome da area, device ID, status  anterior, status  atual, duracao
        const logEntry = `${new Date().toISOString()},${identifier},${areaName},${device_id},${prevState.status},${currentStatus},${duration}s\n`;
        fs.appendFileSync(process.env.CSV_PATH, logEntry);

        console.warn(`>>> ALERTA TRANSIÇÃO : ${identifier} (${areaName}) mudou para ${currentStatus} (Ficou ${duration}s no estado anterior)`);
    }

    // Atualização de estado para o próximo cálculo 
    if (!prevState || prevState.status !== currentStatus) {
        deviceStates.set(identifier, {
            status: currentStatus,
            timestamp: Date.now()
        });
    }
}