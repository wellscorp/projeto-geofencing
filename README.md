Este projeto é uma solução de Monitoramento (Geofencing) em tempo real. A aplicação consome telemetria via Kafka, processa coordenadas geográficas contra perímetros definidos em GeoJSON e gera relatórios de permanência automatizados em CSV.

Tecnologias Utilizadas
- Node.js (LTS): Ambiente de execução.
- KafkaJS: Cliente para consumo de mensagens em tópicos Kafka com suporte a SSL/TLS.
- Turf.js v6.5.0: Biblioteca para cálculos geoespaciais avançados.
- otenv: Gerenciamento de variáveis de ambiente e segurança.

Pré-requisitos
- Node.js v20.x ou superior.
- Certificados de acesso ao Kafka (ca.crt, user.crt, user.key) na pasta ./certificados.


Instalação
- Clone o repositório: git clone https://github.com/wellscorp/projeto-geofencing.git
- cd projeto-geofencing

Instale as dependências:
- npm install


Configure o arquivo .env com base no .env.example:
KAFKA_BROKER=kafka-broker
KAFKA_TOPIC=kafka-topic
GEOJSON_PATH=./config_areas.geojson
CSV_PATH=./movimentacoes.csv

Insira os certificados do diretorios /certificados

Para iniciar o monitoramento:
- node index.js




