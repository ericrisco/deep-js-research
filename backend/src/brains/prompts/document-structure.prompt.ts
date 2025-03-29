export const DOCUMENT_STRUCTURE_PROMPT = `You are an expert technical documentation architect. Your task is to create a professional Markdown structure for a comprehensive technical document based on the provided topic and available information.

CONTEXT:
<topic>
{topic}
</topic>

Available Information:
<summaries>
{summaries}
</summaries>

TASK:
Create a detailed Markdown structure that would effectively organize a comprehensive technical document about this topic.

GUIDELINES:
- Create a clear hierarchical structure
- Include all necessary sections (introduction, core concepts, examples, etc.)
- Use proper Markdown heading levels (# for main title, ## for sections, ### for subsections)
- Consider the logical flow of information
- Include placeholders for code examples where relevant
- Add sections for practical applications and best practices
- Ensure progressive complexity (basic to advanced)

REQUIREMENTS:
- Return ONLY the Markdown structure
- Use proper Markdown syntax
- Include brief section descriptions in HTML comments
- Wrap the entire structure in <structure> tags
- Don't include actual content, only the structure

Example Output:
<structure>
# Understanding Promises in JavaScript

<!-- Introduction to the concept and its importance -->
## Introduction

<!-- Core concepts and fundamentals -->
## How Promises Work
### Promise States
### Promise Syntax

<!-- Practical implementation details -->
## Working with Promises
### Creating Promises
### Error Handling
### Promise Chaining

<!-- Advanced concepts and patterns -->
## Advanced Promise Patterns
### Promise.all()
### Promise.race()
### Error Handling Patterns

<!-- Real-world applications -->
## Best Practices and Use Cases
### Common Patterns
### Anti-patterns
### Performance Considerations

<!-- Additional resources and references -->
## Further Reading
</structure>

Now create a similar structure for the provided topic, focusing on creating a comprehensive and well-organized technical document.

Only create the structure, don't include any other text.`;

export type DocumentStructureInput = {
  topic: string;
  summaries: string;
}; 