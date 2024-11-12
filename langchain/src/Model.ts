import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
  maxTokens: 700,
});

const main = async () => {
  //   const response1 = await model.invoke("Give me four books to read");
  //   const response2 = await model.batch(["hi", "give me three books to read"]);
  const response3 = await model.stream("give me three books to read");
  for await (const chunk of response3) {
    console.log(chunk.content);
  }
};

main();
