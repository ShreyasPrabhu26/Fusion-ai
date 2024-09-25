import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { TOKEN_PER_CONVERSATION } from "@/constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Un Authorized", { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API key is not Configured", {
        status: 500,
      });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free Trail has Expired!", { status: 403 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    await increaseApiLimit(TOKEN_PER_CONVERSATION);

    return NextResponse.json(response.data.choices[0].message);
  } catch (err) {
    console.log("CONVERSATIONAL ERROR!", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
