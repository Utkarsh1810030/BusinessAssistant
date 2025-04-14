// rag.service.js — RAG embedding & Qdrant Cloud setup with UUID-safe insert
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { OpenAIEmbeddings } = require('@langchain/openai');

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const COLLECTION_NAME = 'business_memory';
const openaiEmbeddings = new OpenAIEmbeddings();

const qdrant = axios.create({
  baseURL: QDRANT_URL,
  headers: {
    'api-key': QDRANT_API_KEY,
    'Content-Type': 'application/json'
  }
});

const chunkText = (text, chunkSize = 800) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

const ensureCollection = async () => {
    try {
      await qdrant.put(`/collections/${COLLECTION_NAME}`, {
        vectors: {
          size: 1536,
          distance: 'Cosine'
        }
      });
    } catch (err) {
      if (err.response?.status === 409) {
        console.warn(`Collection ${COLLECTION_NAME} already exists.`);
      } else {
        console.error('Failed to ensure Qdrant collection:', err.response?.data || err.message);
      }
    }
  };
  

const upsertDocuments = async ({ userId, items = [], businessName }) => {
  await ensureCollection();
  const allChunks = [];

  for (const item of items) {
    const pretext = `${businessName || 'one.comn'}: `;
    const chunks = chunkText(pretext + item.text);

    let embeddings;
    try {
      embeddings = await openaiEmbeddings.embedDocuments(chunks);
    } catch (err) {
      console.error('❌ Embedding error:', err.message, err.response?.data || '');
      return { success: false };
    }

    chunks.forEach((chunk, idx) => {
      allChunks.push({
        id: uuidv4(),
        vector: embeddings[idx],
        payload: {
          userId,
          text: chunk,
          source: item.source || 'manual',
          type: item.type || 'generic'
        }
      });
    });
  }

  const points = allChunks.map(doc => ({
    id: doc.id,
    vector: doc.vector.map(v => Number.isFinite(v) ? v : 0),
    payload: {
      userId: userId.toString(),
      text: doc.payload.text.slice(0, 2048),
      type: doc.payload.type || 'generic',
      source: doc.payload.source || 'manual'
    }
  }));

  console.log('🧪 Inserting points sample:', points[0]);

  try {
    await qdrant.put(`/collections/${COLLECTION_NAME}/points?wait=true`, { points });
    return { success: true };
  } catch (err) {
    console.error('❌ Qdrant insert failed:', err.response?.data || err.message);
    return { success: false };
  }
};

const queryRelevantDocs = async ({ userId, query, topK = 5 }) => {
  const embedded = await openaiEmbeddings.embedQuery(query);

  try {
    const res = await qdrant.post(`/collections/${COLLECTION_NAME}/points/search`, {
        vector: embedded,
        top: topK,
        with_payload: true, // ✅ this brings back full text
        filter: {
          must: [{ key: 'userId', match: { value: userId.toString() } }]
        }
      });
      
    console.log('🧠 Qdrant search result:', res.data);


    return res.data?.result?.map(r => r.payload?.text).filter(Boolean) || [];
  } catch (err) {
    console.error('❌ Qdrant search error:', err.message);
    return [];
  }
};

module.exports = {
  upsertDocuments,
  queryRelevantDocs
};
