import { StateGraph, END } from '@langchain/langgraph';
import { config } from '../config/config';
import { ResearchState } from '../interfaces/state.interface';
import { SearchPlannerBrain } from '../brains/SearchPlannerBrain';
import { TavilySearchTool } from '../tools/TavilySearchTool';
import { ContentSummarizerBrain } from '../brains/ContentSummarizerBrain';
import { GapAnalyzerBrain } from '../brains/GapAnalyzerBrain';
import { DocumentStructureBrain } from '../brains/DocumentStructureBrain';
import { ContentGeneratorBrain } from '../brains/ContentGeneratorBrain';
import logger from '../utils/logger';
import { ResearchStep } from '../interfaces/deepresearch.interface';

export type ProgressCallback = (step: ResearchStep, progress: number, details: string) => void;

export const createResearchGraph = (onProgress?: ProgressCallback) => {
  const graph = new StateGraph<ResearchState>({
    channels: {
      researchQuery: { value: null, default: () => "" },
      searchPlan: { value: null },
      searchResults: { value: null },
      gapQuery: { value: null },
      documentStructure: { value: null },
      finalDocument: { value: null },
      findGapLoops: { value: null, default: () => 0 }
    }
  });

  const searchPlanner = new SearchPlannerBrain();
  const searchTool = new TavilySearchTool();
  const summarizer = new ContentSummarizerBrain();
  const gapAnalyzer = new GapAnalyzerBrain();
  const structureGenerator = new DocumentStructureBrain();
  const contentGenerator = new ContentGeneratorBrain();

  // Add nodes
  graph.addNode("search_planner", async (state) => {
    logger.info('Creating search plan...');
    onProgress?.("search_planner", 10, "Planning search strategy...");
    return await searchPlanner.invoke(state);
  });

  graph.addNode("search", async (state) => {
    logger.info('Searching for information...');
    onProgress?.("search", 25, "Searching for relevant information...");
    return await searchTool.invoke(state);
  });

  graph.addNode("summarize", async (state) => {
    logger.info('Summarizing search results...');
    onProgress?.("summarize", 40, "Summarizing found information...");
    return await summarizer.invoke(state);
  });

  graph.addNode("analyze_gaps", async (state) => {
    logger.info(`Analyzing knowledge gaps (Loop ${state.findGapLoops + 1})...`);
    onProgress?.("analyze_gaps", 60, `Analyzing knowledge gaps (Loop ${state.findGapLoops + 1})...`);
    const newState = await gapAnalyzer.invoke(state);
    return {
      ...newState,
      findGapLoops: state.findGapLoops + 1
    };
  });

  graph.addNode("generate_structure", async (state) => {
    logger.info('Generating document structure...');
    onProgress?.("generate_structure", 75, "Generating document structure...");
    return await structureGenerator.invoke(state);
  });

  graph.addNode("generate_content", async (state) => {
    logger.info('Generating final document...');
    onProgress?.("generate_content", 90, "Generating final document...");
    return await contentGenerator.invoke(state);
  });

  // Define conditional edges
  const shouldContinueSearching = (state: ResearchState) => {
    if (state.gapQuery === 'NONE') {
      logger.info('No knowledge gaps found, proceeding to document generation...');
      return false;
    }

    if (state.findGapLoops >= config.research.maxGapLoops) {
      logger.info(`Reached maximum gap search loops (${config.research.maxGapLoops}), proceeding to document generation...`);
      return false;
    }

    logger.info(`Found knowledge gap "${state.gapQuery}", continuing search...`);
    return true;
  };

  // Connect nodes
  graph.addEdge("search_planner", "search");
  graph.addEdge("search", "summarize");
  graph.addEdge("summarize", "analyze_gaps");

  // Conditional branching after gap analysis
  graph.addConditionalEdges(
    "analyze_gaps",
    (state: ResearchState) => {
      if (shouldContinueSearching(state)) {
        return "search";
      }
      return "generate_structure";
    }
  );

  graph.addEdge("generate_structure", "generate_content");
  graph.addEdge("generate_content", END);

  // Set entry point
  graph.setEntryPoint("search_planner");

  return graph.compile();
};

export type ResearchGraph = ReturnType<typeof createResearchGraph>; 