import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
  maxTokens: 700,
});

const fromTemplate = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {product_name}"
  );

  //   Creating a chain
  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: "iPhone",
  });
};

const fromMessage = async () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Write a short description for the product provided by the user",
    ],
    ["human", "{product_name}"],
  ]);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: "iPhone 13 Pro",
  });
  console.log(response.content);
};

const main = async () => {
  await fromMessage();
};

main();
