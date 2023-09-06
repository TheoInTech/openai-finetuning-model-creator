import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const apiKey = formData.get("apiKey") as string;
  const file = formData.get("file") as File;

  if (!formData) {
    return new NextResponse("Data is required", { status: 400 });
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const validFile = await openai.files.create({
      file: file,
      purpose: "fine-tune",
    });

    if (!validFile || !validFile.id) {
      return new NextResponse(
        "File is not in valid format. Please follow the file template.",
        { status: 400 }
      );
    }

    return NextResponse.json(validFile, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
