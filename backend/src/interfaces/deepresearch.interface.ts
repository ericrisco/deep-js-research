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