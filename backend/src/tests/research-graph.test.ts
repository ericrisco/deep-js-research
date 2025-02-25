import { createResearchGraph } from '../graph/research.graph';
import { ResearchState } from '../interfaces/state.interface';
import logger from '../utils/logger';

const TEST_QUERIES = [
  "How does the JavaScript event loop work?",
  "What are JavaScript Promises and how do they work?",
  "Explain React's Virtual DOM and reconciliation process",
  "What is TypeScript and how does it enhance JavaScript?"
];

async function testResearchGraph() {
  const graph = createResearchGraph();
  const query = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];

  console.log('\n🔬 Testing Research Graph');
  console.log('=======================\n');
  
  console.log(`📝 Research Query: "${query}"\n`);

  try {
    const initialState: ResearchState = {
      researchQuery: query,
      findGapLoops: 0
    };

    console.log('⚡ Starting research process...\n');
    
    const result = await graph.invoke(initialState);
    
    console.log('\n✅ Research Complete!');
    console.log('===================\n');
    
    console.log('📊 Research Statistics:');
    console.log('--------------------');
    console.log(`🔄 Gap Search Loops: ${result.findGapLoops}`);
    console.log(`🔍 Search Results: ${result.searchResults?.length || 0}`);
    console.log(`📑 Document Structure Length: ${result.documentStructure?.split('\n').length || 0} lines`);
    console.log(`📚 Final Document Length: ${result.finalDocument?.split('\n').length || 0} lines\n`);

    console.log('📄 Final Document Preview:');
    console.log('----------------------\n');
    if (result.finalDocument) {
      // Show first 20 lines of the document
      console.log(result.finalDocument.split('\n').slice(0, 20).join('\n'));
      console.log('\n... (truncated for brevity)');
    } else {
      console.log('❌ No document generated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testResearchGraph(); 