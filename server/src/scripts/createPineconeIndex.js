const { Pinecone } = require('@pinecone-database/pinecone');
const env = require('../config/env');

const createIndex = async () => {
  try {
    console.log('[PINECONE] Connecting to Pinecone...');
    const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY });

    const indexName = env.PINECONE_INDEX || 'collagerag-index';
    console.log(`[PINECONE] Checking if index "${indexName}" exists...`);
    
    const { indexes } = await pc.listIndexes();
    const exists = indexes.some(idx => idx.name === indexName);

    if (exists) {
      console.log(`[PINECONE] Index "${indexName}" already exists!`);
      process.exit(0);
    }

    console.log(`[PINECONE] Index "${indexName}" not found. Creating index...`);
    console.log(`- Dimension: 768`);
    console.log(`- Metric: cosine`);
    console.log(`- Spec: serverless (aws / us-east-1)`);

    await pc.createIndex({
      name: indexName,
      dimension: 768,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });

    console.log(`[PINECONE] Index creation initiated successfully! It may take a minute to initialize.`);
    process.exit(0);
  } catch (error) {
    console.error(`[PINECONE ERROR] Failed to create index: ${error.message}`);
    process.exit(1);
  }
};

createIndex();
