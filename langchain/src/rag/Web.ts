import { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const loader = new CheerioWebBaseLoader(
  "https://en.wikipedia.org/wiki/Formula_One"
);

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
});

const question = "What is F1 Racing?";

const main = async () => {
  const myData = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const splittedData = await splitter.splitDocuments(myData);

  // Create a vector store
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  // Add data to the vector store
  await vectorStore.addDocuments(splittedData);

  // create data retriever
  const retreiver = vectorStore.asRetriever({
    k: 2,
  });

  // Use the LLM chain to find relevant documents
  const result = await retreiver._getRelevantDocuments(question);
  const resultDocs = result.map((result) => result.pageContent);

  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users question based on the following context: {context}",
    ],
    ["user", "{input}"],
  ]);

  const chain = template.pipe(model);
  const response = await chain.invoke({
    input: question,
    context: resultDocs,
  });

  console.log(response.content);
};

main();
