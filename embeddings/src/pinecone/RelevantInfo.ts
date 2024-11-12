import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pineCone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type Info = {
  info: string;
  reference: string;
  relevance: number;
};

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

const dataToEmbed: Info[] = [
  {
    info: studentInfo,
    relevance: 0.9,
    reference: "some student 123",
  },
  {
    info: clubInfo,
    relevance: 0.8,
    reference: "some club 456",
  },
  {
    info: universityInfo,
    relevance: 0.7,
    reference: "some university 789",
  },
];

const pineConeIndex = pineCone.index<Info>("cool-index");

const storeEmbeddings = async () => {
  // Create Data Embeddings
  await Promise.all(
    dataToEmbed.map(async (item, index) => {
      const embeddingResult = await openAi.embeddings.create({
        model: "text-embedding-3-small",
        input: item.info,
      });
      const embedding = embeddingResult.data[0].embedding;

      // Store the embedding in Pinecone index with metadata as the reference and relevance score.
      await pineConeIndex.upsert([
        {
          id: `id-${index}`,
          values: embedding,
          metadata: item,
        },
      ]);
    })
  );
};

const queryEmbeddings = async (question: string) => {
  // Generate embedding for the question using OpenAI embeddings.
  const embeddingResult = await openAi.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const queryEmbedding = embeddingResult.data[0].embedding;

  // Query the Pinecone index for the closest matches to the query embedding.
  const queryResult = await pineConeIndex.query({
    vector: queryEmbedding,
    topK: 1,
    includeMetadata: true,
    includeValues: true,
  });
  return queryResult;
};

const askOpenAI = async (question: string, relevantInfo: string) => {
  // Generate an OpenAI completion using the relevant info.
  const response = await openAi.chat.completions.create({
    temperature: 0,
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: `answer the next question using this information:${relevantInfo}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });
  const responseMessage = response.choices[0].message;
  console.log(responseMessage);
};

const main = async () => {
  const question = "What does Alexandra like to do in her free time?";
  const result = await queryEmbeddings(question);
  const relevantInfo = result.matches[0].metadata;
  if (relevantInfo) {
    askOpenAI(question, relevantInfo.info);
  }
  console.log(result);
};

main();

// Create PineCone and OpenAI connections
// Store the data in vector store by calling storeEmbedding Function along with Metadata
// Make a function to embed the question i.e queryEmbeddings and run a query to match it with the Vector DB
// Extract the Metadata from the queryEmbeddings function and pass it to the askOpenAI function to give it context
