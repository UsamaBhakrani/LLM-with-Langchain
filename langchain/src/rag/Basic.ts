import { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
});

const myData = [
  "my name is John",
  "my favorite food is pizza",
  "I like to eat walnuts",
];

const question = "What are my favorite foods?";

const main = async () => {
  // Create a vector store
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  // Add data to the vector store
  await vectorStore.addDocuments(
    myData.map((content) => new Document({ pageContent: content }))
  );

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
