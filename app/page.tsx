import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import Link from "next/link";
import ManualInput from "./ManualInput";
import UploadCsv from "./UploadCsv";

export default function Home() {
  return (
    <div className="flex w-full h-full flex-col gap-8 p-16 m-16 max-w-[50rem] bg-muted rounded-2xl shadow-md">
      <h1 className="self-center text-4xl font-bold">
        OpenAI Fine-Tuning Model Creator
      </h1>
      <p className="text-sm text-justify">
        <span className="font-bold">Disclaimer</span>: We do not save anything
        to a database. Everything you input or upload here will be directly
        communicating to our API to create your OpenAI fine-tuning job and
        model. This is an{" "}
        <Link
          href={"https://github.com/theointech/openai-finetuning-model-creator"}
          target="_blank"
          className="font-bold text-blue-500 hover:underline hover:underline-offset-2"
        >
          opensource
        </Link>{" "}
        project made with 💩 by{" "}
        <Link
          href={"https://theoin.tech"}
          target="_blank"
          className="font-bold text-blue-500 hover:underline hover:underline-offset-2"
        >
          Theo in Tech
        </Link>
        .
      </p>

      <Tabs
        defaultValue="manual"
        className="flex flex-col items-start justify-start w-full gap-4 text-primary"
      >
        <TabsList className="bg-gray-200">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="upload" disabled>
            Upload CSV
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <ManualInput />
        </TabsContent>
        <TabsContent value="upload">
          <UploadCsv />
        </TabsContent>
      </Tabs>
    </div>
  );
}
