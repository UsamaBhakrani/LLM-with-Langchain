import OpenAI from "openai";

interface Tool {}

const openai = new OpenAI();

const getTimeOfDay = () => {
  return "5:45";
};

const callOpenAIWithTools = async () => {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant which gives information about the time of day",
    },
    {
      role: "user",
      content: "what is the time of day?",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "get time of day",
        },
      },
    ],
    tool_choice: "auto",
  });

  console.log(response.choices[0].message.content);
};

callOpenAIWithTools();
