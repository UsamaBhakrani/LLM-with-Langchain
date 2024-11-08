import OpenAI from "openai";

interface Tool {}

const openai = new OpenAI();

const getTimeOfDay = () => {
  return "5:45";
};

const getOrderStatus = (orderId: string) => {
  const orderAsNumber = parseInt(orderId);

  if (orderAsNumber % 2 == 0) {
    return "Order is not confirmed";
  }
  return "Order is confirmed";
};

const callOpenAIWithTools = async () => {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant which gives information about the time of day and order status",
    },
    {
      role: "user",
      content: "what is the status of order 1234?",
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
      {
        type: "function",
        function: {
          name: "getOrderStatus",
          description: "Returns the order status",
          parameters: {
            type: "object",
            properties: {
              orderId: {
                type: "string",
                description: "The id of the order to get the order status from",
              },
            },
            required: ["orderId"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const willInvokeFunction = (response.choices[0].finish_reason = "tool_calls");
  const tool_calls = response.choices[0].message.tool_calls![0];

  if (willInvokeFunction) {
    const toolName = tool_calls.function.name;

    if (toolName === "getTimeOfDay") {
      const toolResponse = getTimeOfDay();
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: tool_calls.id,
      });
    }
    if (toolName === "getOrderStatus") {
      const rawArgument = tool_calls.function.arguments;
      const parsedArguments = JSON.parse(rawArgument);
      const toolResponse = getOrderStatus(parsedArguments.orderId);
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: tool_calls.id,
      });
    }
  }

  const secondResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  console.log(secondResponse.choices[0].message.content);
};

callOpenAIWithTools();
