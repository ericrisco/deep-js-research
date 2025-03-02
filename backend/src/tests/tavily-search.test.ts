import { TavilySearchTool } from '../tools/TavilySearchTool';
import { ResearchState } from '../interfaces/state.interface';

const TEST_SEARCH_PLANS = [
  "JavaScript event loop implementation event-driven programming asynchronous execution call stack",
  "JavaScript Promise.all Promise.race concurrent promise handling parallel execution",
  "React Virtual DOM rendering optimization diffing algorithm performance benefits",
  "TypeScript decorators metadata reflection design patterns implementation examples"
];

async function testTavilySearch() {
  const tool = new TavilySearchTool();
  const searchPlan = TEST_SEARCH_PLANS[Math.floor(Math.random() * TEST_SEARCH_PLANS.length)];

  console.log('\n🔍 Testing TavilySearchTool');
  console.log('=========================\n');
  
  console.log(`📝 Search Plan: "${searchPlan}"\n`);

  try {
    const initialState: ResearchState = {
      findGapLoops: 0,
      researchQuery: "original query",
      searchPlan: searchPlan
    };

    console.log('⏳ Searching...\n');
    
    const result = await tool.invoke(initialState);
    
    console.log('✅ Success!');
    console.log('------------\n');
    
    if (result.searchResults) {
      console.log(`Found ${result.searchResults.length} results:\n`);
      
      result.searchResults.forEach((res, index) => {
        console.log(`Result ${index + 1}:`);
        console.log(`🔗 ${res.url}`);
        console.log(`📖 ${res.title}`);
        console.log(`🎯 Score: ${res.score}`);
        console.log(`📄 Content Preview: ${res.content.substring(0, 150)}...\n`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testTavilySearch(); 