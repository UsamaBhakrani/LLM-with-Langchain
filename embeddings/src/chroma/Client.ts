import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { configDotenv } from "dotenv";

configDotenv();

const client = new ChromaClient({
  path: "http://localhost:8000",
});

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: "text-embedding-3-small",
});

const main = async () => {
  await client.api
    .createTenant({ name: "Usama" })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

const addData = async () => {
  const collection = await client.getCollection({
    name: "data-test",
    embeddingFunction,
  });
  const result = await collection.add({
    ids: ["id0"],
    documents: ["Here is my entry"],
    embeddings: [[0.1, 0.2]],
  });

  console.log(result);
};

addData();
