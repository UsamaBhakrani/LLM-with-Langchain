import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { configDotenv } from "dotenv";
import OpenAI from "openai";

configDotenv();

const client = new ChromaClient({
  path: "http://localhost:8000",
});

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

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: "text-embedding-3-small",
});

const collectionName = "personal-info";

const createCollection = async () => {
  await client.createCollection({
    name: collectionName,
    embeddingFunction,
  });
};

const getCollection = async () => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction,
  });
  return collection;
};

const populateCollection = async () => {
  const collection = await getCollection();
  await collection.add({
    ids: ["id1", "id2", "id3"],
    documents: [studentInfo, clubInfo, universityInfo],
  });
};

const askQuestion = async () => {
  const collection = await getCollection();
  const question =
    "tell me the size of the washington buildings in square yards";

  const results = await collection.query({
    queryTexts: question,
    nResults: 1,
  });

  const relevantInfo = results.documents[0][0];

  if (relevantInfo) {
    const openAi = new OpenAI();
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "assistant",
          content: `Answer the next question using this info: ${relevantInfo}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });
    const responseMessage = response.choices[0].message;
    console.log(responseMessage.content);
  }
};

const main = async () => {
  await askQuestion();
};

main();
