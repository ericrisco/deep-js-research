export type ResearchStep = 
  | 'start'
  | 'initialize_brain'
  | 'pick_nose'
  | 'analyze_booger'
  | 'contemplate_existence'
  | 'drink_coffee'
  | 'pretend_to_work'
  | 'look_busy'
  | 'eureka_moment'
  | 'stop';

export interface ResearchMessage {
  step: ResearchStep;
  timestamp: string;
  progress: number;
  details?: string;
  query?: string;
}

export interface StartResearchMessage {
  action: 'start';
  query: string;
} 