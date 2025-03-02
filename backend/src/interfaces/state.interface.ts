export interface SearchResult {
  title: string;
  url: string;
  content: string;
  rawContent: string;
  score: number;
  summary?: string;
}

export interface ResearchState {
  researchQuery: string;
  searchPlan?: string;
  searchResults?: SearchResult[];
  gapQuery?: string;
  documentStructure?: string;
  finalDocument?: string;
  findGapLoops: number;
  // We'll add more state properties as we develop more nodes
} 