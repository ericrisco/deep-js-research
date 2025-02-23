import WebSocket from 'ws';
import { config } from '../config/config';

const TEST_QUERIES = [
  '¿Por qué el cielo es azul?',
  '¿Cuál es el sentido de la vida?',
  '¿Por qué los gatos ronronean?'
];

const wsUrl = `ws://localhost:${config.port}${config.ws.path}`;
console.log(`\n🔌 Conectando a ${wsUrl}\n`);

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('✅ Conexión establecida\n');
  const randomQuery = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];
  
  console.log(`📤 Enviando query: "${randomQuery}"\n`);
  ws.send(JSON.stringify({
    action: 'start',
    query: randomQuery
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  if (message.error) {
    console.log(`❌ Error: ${message.error}`);
    return;
  }

  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  const progressBar = createProgressBar(message.progress);
  
  console.log(`[${timestamp}] ${progressBar} ${message.progress}%`);
  console.log(`📝 ${message.details}\n`);

  if (message.step === 'stop') {
    console.log('✅ Test completado');
    ws.close();
    process.exit(0);
  }
});

ws.on('error', (error) => {
  console.error('❌ Error de WebSocket:', error);
  process.exit(1);
});

function createProgressBar(progress: number): string {
  const width = 30;
  const filled = Math.round(width * (progress / 100));
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
} 