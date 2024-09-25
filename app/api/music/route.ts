import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { getApiLimitInfo, increaseApiLimit } from "@/lib/api-limit";
import { TOKEN_PER_MUSIC_GENERATION } from "@/constants";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) return new NextResponse("UnAuthorized", { status: 401 });

    if (!prompt) return new NextResponse("Prompt is Required", { status: 400 });

    const { usedTokens, tokenLimit } = await getApiLimitInfo();

    if (!usedTokens || !tokenLimit) {
      return new NextResponse("Token information is not available", {
        status: 500,
      });
    }

    if (usedTokens > tokenLimit)
      return new NextResponse("Token Has Expired Please Upgrade your Plan", {
        status: 403,
      });

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    await increaseApiLimit(TOKEN_PER_MUSIC_GENERATION);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
