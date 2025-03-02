import { GapAnalyzerBrain } from '../brains/GapAnalyzerBrain';
import { ResearchState } from '../interfaces/state.interface';

const TEST_STATE: ResearchState = {
  findGapLoops: 0,
  researchQuery: "How does the JavaScript event loop work?",
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
  ]
};

async function testGapAnalyzer() {
  const brain = new GapAnalyzerBrain();

  console.log('\n🔍 Testing GapAnalyzerBrain');
  console.log('=========================\n');
  
  console.log(`📝 Research Topic: "${TEST_STATE.researchQuery}"\n`);
  console.log('Available Summaries:');
  TEST_STATE.searchResults?.forEach((result, index) => {
    console.log(`\nSource ${index + 1}:`);
    console.log(result.summary);
  });
  console.log('\n');

  try {
    console.log('⏳ Analyzing knowledge gaps...\n');
    
    const result = await brain.invoke(TEST_STATE);
    
    console.log('✅ Analysis Complete!');
    console.log('-------------------\n');
    
    if (result.gapQuery) {
      console.log('🔍 Knowledge Gap Found!');
      console.log(`Missing Information Query: "${result.gapQuery}"\n`);
    } else {
      console.log('✨ No Knowledge Gaps Found!');
      console.log('Information coverage appears to be complete.\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testGapAnalyzer(); 