import { WebSocket } from 'ws';
import { ResearchMessage, ResearchStep } from '../interfaces/deepresearch.interface';
import logger from '../utils/logger';

export class DeepResearchService {
  private steps: Array<{
    step: ResearchStep;
    duration: number;
    messageTemplate: string;
  }> = [
    { step: 'start', duration: 1000, messageTemplate: 'Iniciando investigación profunda sobre: "{query}"...' },
    { step: 'initialize_brain', duration: 2000, messageTemplate: 'Calentando neuronas para procesar: "{query}"...' },
    { step: 'pick_nose', duration: 3000, messageTemplate: 'Extrayendo material de investigación nasal mientras pienso en {query}...' },
    { step: 'analyze_booger', duration: 2500, messageTemplate: 'Analizando composición del material extraído en busca de respuestas sobre {query}...' },
    { step: 'contemplate_existence', duration: 4000, messageTemplate: '¿Por qué alguien querría saber sobre {query}? ¿Cuál es el sentido de todo?' },
    { step: 'drink_coffee', duration: 2000, messageTemplate: 'Recargando energía con café para seguir investigando {query}...' },
    { step: 'pretend_to_work', duration: 3500, messageTemplate: 'Aparentando productividad mientras proceso {query}...' },
    { step: 'look_busy', duration: 2800, messageTemplate: 'Moviendo el ratón aleatoriamente mientras analizo {query}...' },
    { step: 'eureka_moment', duration: 1500, messageTemplate: '¡EUREKA! ¡He encontrado algo sobre {query}! ... ¿Qué he encontrado?' },
    { step: 'stop', duration: 1000, messageTemplate: 'Investigación sobre "{query}" completada. Limpiando evidencias...' }
  ];

  private sendMessage(ws: WebSocket, step: ResearchStep, progress: number, details: string, query: string) {
    const message: ResearchMessage = {
      step,
      timestamp: new Date().toISOString(),
      progress,
      details,
      query
    };
    ws.send(JSON.stringify(message));
    logger.info(`Research step: ${step}`, { progress, details, query });
  }

  public async startResearch(ws: WebSocket, query: string): Promise<void> {
    const totalSteps = this.steps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const { step, duration, messageTemplate } = this.steps[i];
      const progress = Math.round((i / (totalSteps - 1)) * 100);
      const message = messageTemplate.replace(/{query}/g, query);
      
      await new Promise(resolve => setTimeout(resolve, duration));
      this.sendMessage(ws, step, progress, message, query);
    }
  }
} 