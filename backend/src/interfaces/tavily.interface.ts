export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  rawContent?: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilyResult[];
  query: string;
  responseTime: number;
} 