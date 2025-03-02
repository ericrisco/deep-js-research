import { DocumentStructureBrain } from '../brains/DocumentStructureBrain';
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

async function testDocumentStructure() {
  const brain = new DocumentStructureBrain();

  console.log('\n📝 Testing DocumentStructureBrain');
  console.log('==============================\n');
  
  console.log(`📚 Topic: "${TEST_STATE.researchQuery}"\n`);
  console.log('Available Information:');
  TEST_STATE.searchResults?.forEach((result, index) => {
    console.log(`\nSource ${index + 1}:`);
    console.log(result.summary);
  });
  console.log('\n');

  try {
    console.log('⏳ Generating document structure...\n');
    
    const result = await brain.invoke(TEST_STATE);
    
    console.log('✅ Structure Generated!');
    console.log('=====================\n');
    
    if (result.documentStructure) {
      console.log('📋 Document Structure:');
      console.log('-------------------\n');
      console.log(result.documentStructure);
    } else {
      console.log('❌ No structure generated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testDocumentStructure(); 