import { SearchPlannerBrain } from '../brains/SearchPlannerBrain';
import { ResearchState } from '../interfaces/state.interface';

const TEST_QUERIES = [
  "Can you explain how the JavaScript event loop works in detail?",
  "What's the difference between Promise.all and Promise.race in JavaScript?",
  "How does React's virtual DOM work and why is it important?",
  "Explain TypeScript decorators and their use cases"
];

async function testSearchPlanner() {
  const brain = new SearchPlannerBrain();
  const query = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];

  console.log('\n🧠 Testing SearchPlannerBrain');
  console.log('============================\n');
  
  console.log(`📝 Input Query: "${query}"\n`);

  try {
    const initialState: ResearchState = {
      findGapLoops: 0,
      researchQuery: query
    };

    console.log('⏳ Processing...\n');
    
    const result = await brain.invoke(initialState);
    
    console.log('✅ Success!');
    console.log('------------\n');
    console.log('🔍 Search Plan:', result.searchPlan);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSearchPlanner(); 