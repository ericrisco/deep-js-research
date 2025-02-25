import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { config } from '../config/config';
import { CONTENT_SUMMARIZER_PROMPT } from './prompts/content-summarizer.prompt';
import { ResearchState, SearchResult } from '../interfaces/state.interface';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import logger from '../utils/logger';

export class ContentSummarizerBrain {
  private model: ChatOllama;
  private prompt: PromptTemplate;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: config.llm.ollamaBaseUrl,
      model: config.llm.generatingModel,
      temperature: 0
    });

    this.prompt = PromptTemplate.fromTemplate(CONTENT_SUMMARIZER_PROMPT);
  }

  private async summarizeContent(result: SearchResult, topic: string): Promise<SearchResult> {
    try {
      const formattedPrompt = await this.prompt.format({
        topic,
        content: result.rawContent
      });

      const response = await this.model.invoke(formattedPrompt);

      const summary = response.content.toString();

      return {
        ...result,
        summary
      };
    } catch (error) {
      logger.error(`Error summarizing content from ${result.url}:`, error);
      return {
        ...result,
        summary: 'Failed to generate summary.'
      };
    }
  }

  async invoke(state: ResearchState): Promise<ResearchState> {
    if (!state.searchResults || state.searchResults.length === 0) {
      throw new Error('No search results available to summarize');
    }

    logger.info(`Starting parallel summarization of ${state.searchResults.length} results`);

    const summarizedResults = await Promise.all(
      state.searchResults.map(result => 
        this.summarizeContent(result, state.researchQuery)
      )
    );

    logger.info('Completed summarization of all results');

    return {
      ...state,
      searchResults: summarizedResults
    };
  }
} 