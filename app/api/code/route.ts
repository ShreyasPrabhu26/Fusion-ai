import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

import { getApiLimitInfo, increaseApiLimit } from "@/lib/api-limit";
import { TOKEN_PER_CODE } from "@/constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const insructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippet. Use code comments for explanations.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("UnAuthorized", { status: 401 });

    if (!configuration.apiKey)
      return new NextResponse("OpenAI API Key Not Configured", { status: 500 });

    if (!messages)
      return new NextResponse("Messages Are Required", { status: 400 });

    const { usedTokens, tokenLimit } = await getApiLimitInfo();

    if (usedTokens === undefined || tokenLimit === undefined) {
      return new NextResponse("Token information is not available", {
        status: 500,
      });
    }

    if (usedTokens > tokenLimit)
      return new NextResponse("Token Has Expired Please Upgrade your Plan", {
        status: 403,
      });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [insructionMessage, ...messages],
    });

    await increaseApiLimit(TOKEN_PER_CODE);

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
