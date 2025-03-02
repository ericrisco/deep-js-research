import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { config } from '../config/config';
import { GAP_ANALYZER_PROMPT } from './prompts/gap-analyzer.prompt';
import { ResearchState } from '../interfaces/state.interface';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { extractFromTags } from '../utils/text.utils';
import logger from '../utils/logger';

export class GapAnalyzerBrain {
  private model: ChatOllama;
  private prompt: PromptTemplate;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: config.llm.ollamaBaseUrl,
      model: config.llm.thinkingModel,
      temperature: 0
    });

    this.prompt = PromptTemplate.fromTemplate(GAP_ANALYZER_PROMPT);
  }

  private concatenateSummaries(state: ResearchState): string {
    if (!state.searchResults) return '';

    return state.searchResults
      .map((result, index) => {
        if (!result.summary) return '';
        return `Source ${index + 1}:\n${result.summary}\n`;
      })
      .join('\n');
  }

  async invoke(state: ResearchState): Promise<ResearchState> {
    if (!state.searchResults || state.searchResults.length === 0) {
      throw new Error('No search results available to analyze');
    }

    const summaries = this.concatenateSummaries(state);
    
    if (!summaries) {
      throw new Error('No summaries available to analyze');
    }

    logger.info('Analyzing knowledge gaps...');

    const formattedPrompt = await this.prompt.format({
      topic: state.researchQuery,
      summaries
    });

    const response = await this.model.invoke(formattedPrompt);

    const gapQuery = extractFromTags(response.content.toString(), 'query');

    logger.info(gapQuery ? `Found knowledge gap: ${gapQuery}` : 'No knowledge gaps found');

    return {
      ...state,
      gapQuery
    };
  }
} 