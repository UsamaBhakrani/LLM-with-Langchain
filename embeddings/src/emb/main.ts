import { readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

const openai = new OpenAI();

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

export const generateEmbeddings = async (input: string | string[]) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
  });
  console.log(response.data[0].embedding);
  return response;
};

export const loadJSONData = <T>(fileName: string): T => {
  const path = join(__dirname, fileName);
  const rawData = readFileSync(path);
  return JSON.parse(rawData.toString());
};

const saveDataToJson = (data: any, fileName: string) => {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataBuffer);
  console.log(`saved data to ${fileName}`);
};

const main = async () => {
  const data = loadJSONData<string[]>("data.json");
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }
  saveDataToJson(dataWithEmbeddings, "dataWithEmbeddings.json");
};
