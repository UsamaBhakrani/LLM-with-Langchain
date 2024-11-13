import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.8,
});

const stringParser = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {product_name}"
  );

  const parser = new StringOutputParser();

  //   Creating a chain
  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    product_name: "iPhone",
  });
  console.log(response);
};

const commaSeparatedParser = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Provide the first 5 ingredients, separated by commas, for: {product_name}"
  );

  const parser = new CommaSeparatedListOutputParser();

  //   Creating a chain
  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    product_name: "iPhone",
  });
  console.log(response);
};

const structuredParser = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    `Extract information from the following phrase.
    formatting instructions: {format_instructions} 
    phrase:{phrase}`
  );

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    likes: "what the person likes",
  });

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    format_instructions: outputParser.getFormatInstructions(),
    phrase: "John is likes pineapple pizza",
  });
  console.log(response);
};

structuredParser();
