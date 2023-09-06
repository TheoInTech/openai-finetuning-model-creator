import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { apiKey, fileId } = await req.json();

  if (!fileId) {
    return new NextResponse("All data are required", { status: 400 });
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.files.retrieve(fileId);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
