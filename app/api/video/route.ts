import { NextResponse } from "next/server";
import Replicate from "replicate";
import { getApiLimitInfo, increaseApiLimit } from "@/lib/api-limit";

import { auth } from "@clerk/nextjs/server";
import { TOKEN_PER_VIDEO_GENERATION } from "@/constants";

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
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
        },
      }
    );
    await increaseApiLimit(TOKEN_PER_VIDEO_GENERATION);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
