import { IPromptItem } from "@/types/form.types";

export const convertFormDataToJSONL = (formDataArray: IPromptItem[]) => {
  // Initialize an empty string to hold the final JSONL data
  let jsonlData = "";

  // Loop through each formData object in the array and append its JSONL string to jsonlData
  formDataArray.forEach((formData) => {
    const final = {
      messages: [
        { role: "system", content: formData.system },
        { role: "user", content: formData.user },
        { role: "assistant", content: formData.assistant },
      ],
    };

    jsonlData += JSON.stringify(final) + "\n";
  });

  // Create and return a Blob from the accumulated JSONL data
  const blob = new Blob([jsonlData], { type: "application/jsonl" });

  return blob;
};
