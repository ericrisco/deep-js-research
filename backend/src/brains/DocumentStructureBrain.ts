import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { config } from '../config/config';
import { DOCUMENT_STRUCTURE_PROMPT } from './prompts/document-structure.prompt';
import { ResearchState } from '../interfaces/state.interface';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { extractFromTags } from '../utils/text.utils';
import logger from '../utils/logger';

export class DocumentStructureBrain {
  private model: ChatOllama;
  private prompt: PromptTemplate;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: config.llm.ollamaBaseUrl,
      model: config.llm.thinkingModel,
      temperature: 0
    });

    this.prompt = PromptTemplate.fromTemplate(DOCUMENT_STRUCTURE_PROMPT);
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
      throw new Error('No search results available to create document structure');
    }

    const summaries = this.concatenateSummaries(state);
    
    if (!summaries) {
      throw new Error('No summaries available to create document structure');
    }

    logger.info('Generating document structure...');

    const formattedPrompt = await this.prompt.format({
      topic: state.researchQuery,
      summaries
    });

    const response = await this.model.invoke(formattedPrompt)

    const documentStructure = extractFromTags(response.content.toString(), 'structure');

    if (!documentStructure) {
      throw new Error('Failed to generate document structure');
    }

    logger.info('Document structure generated successfully');

    return {
      ...state,
      documentStructure
    };
  }
} 