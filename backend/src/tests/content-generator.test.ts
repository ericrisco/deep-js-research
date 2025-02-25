import { ContentGeneratorBrain } from '../brains/ContentGeneratorBrain';
import { ResearchState } from '../interfaces/state.interface';

const TEST_STATE: ResearchState = {
  researchQuery: "How does the JavaScript event loop work?",
  findGapLoops: 2,
  searchResults: [
    {
      title: "Understanding the JavaScript Event Loop",
      url: "https://example.com/js-event-loop",
      content: "Brief preview...",
      rawContent: "Full content...",
      score: 0.95,
      summary: `The JavaScript event loop is a core mechanism that enables asynchronous programming. 
      It continuously monitors the call stack and callback queue, moving callbacks to the stack when it's empty. 
      This process is fundamental to handling async operations in JavaScript.`
    },
    {
      title: "JavaScript Runtime Components",
      url: "https://example.com/js-runtime",
      content: "Brief preview...",
      rawContent: "Full content...",
      score: 0.88,
      summary: `The JavaScript runtime includes several key components: the heap for memory allocation, 
      the call stack for tracking function calls, and the callback queue for managing async operations. 
      The event loop orchestrates these components to handle asynchronous code execution.`
    }
  ],
  documentStructure: `# Understanding the JavaScript Event Loop

## Introduction
<!-- Overview of the event loop and its importance -->

## Core Components
### Call Stack
### Callback Queue
### Event Loop Mechanism

## Asynchronous Programming
### How Async Operations Work
### Promises and the Event Loop
### async/await Integration

## Best Practices
### Performance Optimization
### Common Pitfalls
### Debugging Techniques

## Advanced Concepts
### Microtasks vs Macrotasks
### Node.js Event Loop Differences
### Browser Implementation Details

## Practical Examples
### Real-world Use Cases
### Performance Patterns
### Anti-patterns to Avoid`
};

async function testContentGenerator() {
  const brain = new ContentGeneratorBrain();

  console.log('\n📝 Testing ContentGeneratorBrain');
  console.log('==============================\n');
  
  console.log(`📚 Topic: "${TEST_STATE.researchQuery}"\n`);
  
  console.log('Available Information:');
  TEST_STATE.searchResults?.forEach((result, index) => {
    console.log(`\nSource ${index + 1}:`);
    console.log(result.summary);
  });
  
  console.log('\nDocument Structure:');
  console.log(TEST_STATE.documentStructure);
  console.log('\n');

  try {
    console.log('⏳ Generating final document...\n');
    
    const result = await brain.invoke(TEST_STATE);
    
    console.log('✅ Document Generated!');
    console.log('=====================\n');
    
    if (result.finalDocument) {
      console.log('📄 Final Document:');
      console.log('---------------\n');
      console.log(result.finalDocument);
    } else {
      console.log('❌ No document generated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testContentGenerator(); 