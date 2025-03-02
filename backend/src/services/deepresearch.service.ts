import { WebSocket } from 'ws';
import { ResearchMessage, ResearchStep } from '../interfaces/deepresearch.interface';
import { createResearchGraph } from '../graph/research.graph';
import { ResearchState } from '../interfaces/state.interface';
import logger from '../utils/logger';

export class DeepResearchService {
  private sendMessage(ws: WebSocket, step: ResearchStep, progress: number, details: string, query: string, completion: string = "") {
    const message: ResearchMessage = {
      step,
      timestamp: new Date().toISOString(),
      progress,
      details,
      query,
      completion
    };
    ws.send(JSON.stringify(message));
    logger.info(`Research step: ${step}`, { progress, details, query });
  }

  public async startResearch(ws: WebSocket, query: string): Promise<void> {
    try {
      const progressCallback = (step: ResearchStep, progress: number, details: string) => {
        this.sendMessage(ws, step, progress, details, query);
      };

      const graph = createResearchGraph(progressCallback);
      const initialState: ResearchState = {
        researchQuery: query,
        findGapLoops: 0
      };

      // Execute graph
      const finalState = await graph.invoke(initialState);

      // Send completion message
      this.sendMessage(
        ws,
        "complete",
        100,
        `Research completed with ${finalState.searchResults?.length || 0} sources and ${finalState.findGapLoops} search iterations`,
        query,
        finalState.finalDocument
      );

    } catch (error) {
      logger.error('Error in research process:', error); 
      this.sendMessage(
        ws,
        "error",
        0,
        error instanceof Error ? error.message : 'Unknown error occurred',
        query
      );
    }
  }
} 