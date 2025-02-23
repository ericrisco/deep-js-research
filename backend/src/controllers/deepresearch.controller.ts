import { WebSocket } from 'ws';
import { DeepResearchService } from '../services/deepresearch.service';
import { StartResearchMessage } from '../interfaces/deepresearch.interface';
import logger from '../utils/logger';

export class DeepResearchController {
  private deepResearchService: DeepResearchService;

  constructor() {
    this.deepResearchService = new DeepResearchService();
  }

  public handleConnection = (ws: WebSocket): void => {
    logger.info('New WebSocket connection established');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message) as StartResearchMessage;
        
        if (data.action === 'start') {
          if (!data.query?.trim()) {
            throw new Error('Query is required');
          }
          
          logger.info(`Starting research for query: ${data.query}`);
          await this.deepResearchService.startResearch(ws, data.query.trim());
        }
      } catch (error) {
        logger.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          error: error instanceof Error ? error.message : 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on('close', () => {
      logger.info('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  };
} 