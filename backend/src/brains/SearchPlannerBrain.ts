import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { config } from '../config/config';
import { SEARCH_PLANNER_PROMPT } from './prompts/search-planner.prompt';
import { ResearchState } from '../interfaces/state.interface';
import {  removeThinkingTags } from '../utils/text.utils';
import { PromptTemplate } from '@langchain/core/prompts';

export class SearchPlannerBrain {
  private model: ChatOllama;
  private prompt: PromptTemplate;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: config.llm.ollamaBaseUrl,
      model: config.llm.thinkingModel,
      temperature: 0
    });

    this.prompt = PromptTemplate.fromTemplate(SEARCH_PLANNER_PROMPT);
  }

  async invoke(state: ResearchState): Promise<ResearchState> {
    const formattedPrompt = await this.prompt.format({
      input: state.researchQuery
    });

    const response = await this.model
      .invoke(formattedPrompt);

    const searchPlan = removeThinkingTags(response.content.toString());

    if (!searchPlan) {
      throw new Error('Failed to generate search plan');
    }

    return {
      ...state,
      searchPlan
    };
  }
} 