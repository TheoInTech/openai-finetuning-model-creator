import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { apiKey, finetuningId } = await req.json();

  if (!finetuningId) {
    return new NextResponse("All data are required", { status: 400 });
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.fineTuning.jobs.retrieve(finetuningId);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
