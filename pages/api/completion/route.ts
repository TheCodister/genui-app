import { ChatOpenAI } from "@langchain/openai";
import { LangChainAdapter } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const model = new ChatOpenAI({
    model: "gpt-3.5-turbo-0125",
    temperature: 0,
  });

  const stream = await model.stream(prompt);

  return LangChainAdapter.toDataStreamResponse(stream);
}
