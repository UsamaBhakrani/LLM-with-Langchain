import { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
});

const question = "What is criteria for Assessing Performance at mazik?";

const main = async () => {
  const loader = new PDFLoader("Handbook.pdf", { splitPages: true });
  const myData = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({ separators: [`. \n`] });

  const splittedData = await splitter.splitDocuments(myData);

  // Create a vector store
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  // Add data to the vector store
  await vectorStore.addDocuments(splittedData);

  // create data retriever
  const retreiver = vectorStore.asRetriever({
    k: 5,
  });

  // Use the LLM chain to find relevant documents
  const result = await retreiver._getRelevantDocuments(question);
  const resultDocs = result.map((result) => result.pageContent);

  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Give reference to the document and answer the users question based on the following context: {context}",
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
