import OpenAI from "openai";

const openai = new OpenAI();

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  { role: "system", content: "You are a helpful chatbot" },
];

const createChatCompletion = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });
  const responseMessage = response.choices[0].message;
  context.push({
    role: "assistant",
    content: responseMessage.content,
  });
  console.log(
    `${response.choices[0].message.role}: ${response.choices[0].message.content}`
  );
};

process.stdin.addListener("data", async function name(input) {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  await createChatCompletion();
});
