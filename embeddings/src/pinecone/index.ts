import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

const pineCone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

type CoolType = {
  coolness: number;
  reference: string;
};

const createIndex = async () => {
  await pineCone.createIndex({
    name: "cool-index",
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });
};

const listIndexes = async () => {
  const result = await pineCone.listIndexes();
  console.log(result);
};

const getIndex = () => {
  const index = pineCone.index<CoolType>("cool-index");
  return index;
};

const createNamespace = async () => {
  const index = getIndex();
  const namespace = index.namespace("cool-namespace");
};

const generateNumbersArray = (length: number) => {
  return Array.from({ length }, () => Math.random());
};

const upsertVectors = async () => {
  const embedding = generateNumbersArray(1536);
  const index = getIndex();

  const upsertResult = await index.upsert([
    {
      id: "id-1",
      values: embedding,
      metadata: {
        coolness: 3,
        reference: "example-reference",
      },
    },
  ]);
};

const queryVectors = async () => {
  const index = getIndex();
  const result = await index.query({
    id: "id-1",
    topK: 1,
    includeMetadata: true,
  });
  console.log(result);
};

const main = async () => {
  await queryVectors();
};
main();
