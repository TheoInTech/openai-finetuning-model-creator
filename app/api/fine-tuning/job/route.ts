import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { apiKey, fileId, model, suffix } = await req.json();

  if (!fileId || !model || !suffix) {
    return new NextResponse("All data are required", { status: 400 });
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.fineTuning.jobs.create({
      training_file: fileId,
      model,
      suffix,
    });

    console.log("response", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
