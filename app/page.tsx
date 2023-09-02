import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import ManualInput from "./ManualInput";
import UploadCsv from "./UploadCsv";

export default function Home() {
  return (
    <div className="flex w-full h-full flex-col gap-8 p-16 m-16 max-w-[50rem] bg-muted rounded-2xl shadow-md">
      <h1 className="text-4xl font-bold self-center">
        OpenAI File-tuning Model Creator
      </h1>
      <p className="text-sm text-justify">
        <span className="font-bold">Disclaimer</span>: We do not save anything
        to a database. Everything you input or upload here will be directly
        communicating to our API to create your OpenAI fine-tuning job and
        model. This is an{" "}
        <Link
          href={
            "https://github.com/theindiehacker/openai-finetuning-model-creator"
          }
          target="_blank"
          className="font-bold hover:underline hover:underline-offset-2 text-blue-500"
        >
          opensource
        </Link>{" "}
        project made with 💩 by{" "}
        <Link
          href={"https://theindiehacker.tech"}
          target="_blank"
          className="font-bold hover:underline hover:underline-offset-2 text-blue-500"
        >
          the indie hacker
        </Link>
        .
      </p>

      <Tabs
        defaultValue="manual"
        className="w-full text-primary flex flex-col gap-4 justify-start items-start"
      >
        <TabsList className="bg-gray-200">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
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
