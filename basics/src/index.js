import OpenAI from "openai";
import { encoding_for_model, Tiktoken } from "tiktoken";

const openai = new OpenAI();

// const completion = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [
//     { role: "system", content: "You are a helpful assistant." },
//     {
//       role: "user",
//       content: "Write a haiku about recursion in programming.",
//     },
//   ],
// });

const encodePrompt = () => {
  const prompt = "How are you today?";
  const encoder = encoding_for_model("gpt-3.5-turbo");
  const words = encoder.encode(prompt);
  console.log(words);
};

encodePrompt();
// console.log(completion.choices[0].message.content);
