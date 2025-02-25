export type ResearchStep = 
  | 'search_planner'
  | 'search'
  | 'summarize'
  | 'analyze_gaps'
  | 'generate_structure'
  | 'generate_content'
  | 'complete'
  | 'error';

export interface ResearchMessage {
  step: ResearchStep;
  timestamp: string;
  progress: number;
  details?: string;
  query?: string;
  completion?: string;
}

export interface StartResearchMessage {
  action: 'start';
  query: string;
}

type WebSocketCallback = (data: ResearchMessage) => void;
type WebSocketErrorCallback = (error: Event) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  
  constructor(url: string) {
    this.url = url;
  }

  connect(
    onMessage: WebSocketCallback,
    onError?: WebSocketErrorCallback
  ): void {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ResearchMessage;
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        if (onError) onError(error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }

  startResearch(query: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: StartResearchMessage = {
        action: 'start',
        query: query
      };
      console.log('Sending research request:', message);
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected, attempting to reconnect');
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket reconnected, sending research request');
          const message: StartResearchMessage = {
            action: 'start',
            query: query
          };
          if (this.socket) {
            this.socket.send(JSON.stringify(message));
          }
        };
      } catch (error) {
        console.error('Failed to reconnect WebSocket:', error);
      }
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
} 