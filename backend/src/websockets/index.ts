import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { DeepResearchController } from '../controllers/deepresearch.controller';
import { config } from '../config/config';
import logger from '../utils/logger';

export const setupWebSocket = (server: HttpServer): void => {
  const wss = new WebSocketServer({ 
    server,
    path: config.ws.path
  });
  const deepResearchController = new DeepResearchController();

  wss.on('connection', (ws, request) => {
    const clientIp = request.socket.remoteAddress;
    logger.info(`New WebSocket connection from ${clientIp} on path ${request.url}`);
    
    deepResearchController.handleConnection(ws);
  });

  wss.on('error', (error) => {
    logger.error('WebSocket server error:', error);
  });

  logger.info(`WebSocket server initialized on path: ${config.ws.path}`);
}; 