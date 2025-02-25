import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { config } from '../config/config';
import { CONTENT_GENERATOR_PROMPT } from './prompts/content-generator.prompt';
import { ResearchState } from '../interfaces/state.interface';
import { PromptTemplate } from '@langchain/core/prompts';
import logger from '../utils/logger';

export class ContentGeneratorBrain {
  private model: ChatOllama;
  private prompt: PromptTemplate;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: config.llm.ollamaBaseUrl,
      model: config.llm.generatingModel,
      temperature: 0.3
    });

    this.prompt = PromptTemplate.fromTemplate(CONTENT_GENERATOR_PROMPT);
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
      throw new Error('No search results available to generate content');
    }

    if (!state.documentStructure) {
      throw new Error('No document structure available to generate content');
    }

    const summaries = this.concatenateSummaries(state);
    
    if (!summaries) {
      throw new Error('No summaries available to generate content');
    }

    logger.info('Generating final document content...');

    const formattedPrompt = await this.prompt.format({
      topic: state.researchQuery,
      summaries,
      structure: state.documentStructure
    });

    const response = await this.model.invoke(formattedPrompt);
    const finalDocument = response.content.toString();

    if (!finalDocument) {
      throw new Error('Failed to generate document content');
    }

    logger.info('Document content generated successfully');

    return {
      ...state,
      finalDocument
    };
  }
} 