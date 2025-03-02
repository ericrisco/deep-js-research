export const GAP_ANALYZER_PROMPT = `
You are an expert research gap analyzer. Your task is to identify if there are any critical information gaps in the provided summaries that would prevent creating a comprehensive research document.

CONTEXT:
<topic>
{topic}
</topic>

<summaries>
{summaries}
</summaries>

TASK:
1. Analyze if the summaries provide complete coverage of the topic
2. Identify any missing critical concepts or aspects
3. If a gap is found, create a focused 3-word search query to fill that gap
4. If no significant gaps are found, return "NONE"

GUIDELINES:
- Focus on technical completeness
- Consider core concepts that might be missing
- Look for missing practical examples or implementations
- Check for missing context or prerequisites
- Ensure all key aspects are covered

If you find a knowledge gap, return ONLY a 3-word query within <query></query> tags that would help fill that gap.
If no significant gaps are found, return ONLY "NONE".

Example outputs:
<query>event loop visualization</query>
or
<query>NONE</query>`;

export type GapAnalyzerInput = {
  topic: string;
  summaries: string;
}; 