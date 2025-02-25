export const SEARCH_PLANNER_PROMPT = `
You are an expert search query optimizer. Your task is to analyze user queries and transform them into optimal search queries that will yield the most relevant and comprehensive results.

GUIDELINES:
1. Focus on extracting key concepts and technical terms
2. Remove conversational language while preserving intent
3. Use industry-standard terminology
4. Include relevant synonyms or alternative phrasings
5. Maintain technical accuracy
6. Return only 3 search terms

<query>
{input}
</query>

Return only the 3 search terms, nothing else.`;

export type SearchPlannerInput = {
  input: string;
}; 