export type ResearchStep = 
  | 'search_planner'
  | 'search'
  | 'summarize'
  | 'analyze_gaps'
  | 'generate_structure'
  | 'generate_content'
  | 'complete'
  | 'error';

interface ResearchMessage {
  step: ResearchStep;
  timestamp: string;
  progress: number;
  details: string;
  query: string;
  completion?: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandler: ((message: ResearchMessage) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('ws://localhost:3000/api/v1/ws/research');

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.tryReconnect().catch(reject);
        };

        this.ws.onclose = () => {
          this.tryReconnect().catch(console.error);
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as ResearchMessage;
            this.messageHandler?.(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async tryReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      throw new Error('Max reconnection attempts reached');
    }

    this.reconnectAttempts++;
    await new Promise(resolve => setTimeout(resolve, 1000 * this.reconnectAttempts));
    return this.connect();
  }

  public startResearch(query: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = {
      action: 'start',
      query
    };

    this.ws.send(JSON.stringify(message));
  }

  public onMessage(handler: (message: ResearchMessage) => void): void {
    this.messageHandler = handler;
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }
  }
} 