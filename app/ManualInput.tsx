"use client";

import FileUploadToast from "@/app/FileUploadToast";
import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { RadioGroup, RadioGroupItem } from "@/components/radio-group";
import { Textarea } from "@/components/textarea";
import { useToast } from "@/components/use-toast";
import { convertFormDataToJSONL } from "@/lib/utils/convertFormDataToJSONL";
import updateLocalStorage from "@/lib/utils/updateLocalStorage";
import {
  FileUploadedProps,
  FinetuningDeployedProps,
  Models,
} from "@/types/form.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormProps, useFieldArray, useForm } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import * as z from "zod";
import ModelDeployedToast from "./ModelDeployedToast";

const ACCEPTED_MODELS = [Models.GPT3, Models.DAVINCI, Models.BABBAGE];

const promptItemSchema = z.object({
  system: z.string().nonempty(`Please enter a "System context" prompt.`),
  user: z.string().nonempty('Please enter a "User" prompt.'),
  assistant: z.string().nonempty('Please enter a "Assistant response" prompt.'),
});

const formSchema = z
  .object({
    apiKey: z.string().nonempty("OpenAI API key is required"),
    model: z.enum([Models.GPT3, Models.DAVINCI, Models.BABBAGE]),
    suffix: z
      .string()
      .nonempty("Model Suffix is required")
      .refine(
        (s) => !s.includes(" "),
        "Spaces are not allowed. Please use dash(-) instead."
      ),
    promptItems: z
      .array(promptItemSchema)
      .refine(
        (arr) => arr.length >= 10,
        "At least 10 example prompts are required by OpenAI. Please add more."
      ),
  })
  .required();

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      raw: true,
    }),
  });

  return form;
}

const ManualInput = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<FileUploadedProps>();
  const [finetuningDeployed, setFinetuningDeployed] =
    useState<FinetuningDeployedProps>();
  const { toast } = useToast();

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      apiKey: "",
      model: Models.GPT3,
      suffix: "",
      promptItems: [{ system: "", user: "", assistant: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "promptItems",
    control: form.control,
  });

  const uploadFile = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const { apiKey, model, suffix, promptItems } = values;
      const jsonl = convertFormDataToJSONL(promptItems);

      const trimSuffix = suffix.trim();
      const formData = new FormData();
      formData.append("apiKey", apiKey);
      formData.append("model", model);
      formData.append("suffix", trimSuffix);
      formData.append("file", jsonl, "data.jsonl");

      const response = await axios.post("/api/fine-tuning/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({
          duration: 100000,
          title: "Uploaded!",
          description: <FileUploadToast />,
        });

        setFileUploaded(response.data);
        updateLocalStorage("file-uploaded", response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error)?.message ??
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployModel = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/fine-tuning/job", {
        apiKey: form.getValues("apiKey"),
        fileId: fileUploaded?.id,
        model: form.getValues("model"),
        suffix: form.getValues("suffix"),
      });

      if (response.status === 200) {
        toast({
          duration: 100000,
          title: "Deployed!",
          description: <ModelDeployedToast />,
        });

        // Clear file uploaded
        secureLocalStorage.removeItem("file-uploaded");
        setFileUploaded(undefined);

        // Set finetuning deployed
        setFinetuningDeployed(response.data);
        updateLocalStorage("finetuning-deployed", response.data);
      } else {
        console.log("error try", response.data);
        throw new Error(response.data);
      }
    } catch (error: any) {
      console.log("error catch", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshUploadStatus = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiKey = form.getValues("apiKey");

      if (!apiKey) {
        throw new Error(
          "API key is required to check the status of the file upload."
        );
      }

      const response = await axios.post(
        "/api/fine-tuning/check-upload-status",
        {
          apiKey,
          fileId: fileUploaded?.id,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Refreshed the upload status",
          description: `Status: ${response.data.status}`,
        });

        setFileUploaded(response.data);
        updateLocalStorage("file-uploaded", response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error)?.message ??
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshDeployedStatus = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiKey = form.getValues("apiKey");

      if (!apiKey) {
        throw new Error(
          "API key is required to check the status of the file upload."
        );
      }

      const response = await axios.post(
        "/api/fine-tuning/check-deploy-status",
        {
          apiKey,
          finetuningId: finetuningDeployed?.id,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Refreshed the deployment status",
          description: `Status: ${response.data.status}`,
        });

        setFinetuningDeployed(response.data);
        updateLocalStorage("finetuning-deployed", response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error)?.message ??
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fileUploadedFromLocalStorage = secureLocalStorage.getItem(
        "file-uploaded"
      ) as string;

      if (fileUploadedFromLocalStorage) {
        setFileUploaded(JSON.parse(fileUploadedFromLocalStorage));
      }
    }
  }, []);

  const keys = [
    {
      name: "system",
      description: 'Usually called the "context" of your prompt.',
    },
    {
      name: "user",
      description: "Your user prompts and details.",
    },
    {
      name: "assistant",
      description:
        "The response you'd want the AI to be trained for, based on your system context and user prompt.",
    },
  ] as const;

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OpenAI API key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="sk-...tH3o"
                    {...field}
                    autoFocus
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  We suggest you create one temporarily for the purpose of this
                  tool. You can delete it later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Default OpenAI Model</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {ACCEPTED_MODELS.map((model) => (
                      <FormItem
                        key={model}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={model} />
                        </FormControl>
                        <FormLabel>{model}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Suffix</FormLabel>
                <FormControl>
                  <Input
                    placeholder="my-project:custom-suffix"
                    {...field}
                    autoFocus
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  The name of your model. It will be appended to the end of the
                  default model name once finalized. (e.g.
                  ft:gpt-3.5-turbo:my-org:custom_suffix)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <hr className="my-4" />
          {fields.map((item, index) => {
            console.log("form?.formState?.errors", form?.formState?.errors);
            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="underline font-bold">Prompt # {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      variant={"destructive"}
                      size={"xs"}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {keys.map((key) => (
                    <FormField
                      key={`${key.name}-${item.id}`}
                      control={form.control}
                      {...form.register(
                        `promptItems.${index}.${key.name}` as const
                      )}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {key.name}
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormDescription>{key.description}</FormDescription>
                          <FormMessage>
                            {
                              form?.formState?.errors?.promptItems?.[index]?.[
                                key.name
                              ]?.message
                            }
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <hr className="my-4" />
              </div>
            );
          })}

          <Button
            variant={"secondary"}
            disabled={isLoading}
            onClick={(e: any) => {
              e.preventDefault();
              append({
                system: "",
                user: "",
                assistant: "",
              });
            }}
            className="p-0 self-start"
          >
            <Plus className="mr-2" /> Add New Prompt Item
          </Button>
          <div className="flex gap-2 items-center">
            <Button
              type="submit"
              onClick={form.handleSubmit(uploadFile)}
              disabled={isLoading}
            >
              Upload File
            </Button>

            <Button
              onClick={handleDeployModel}
              disabled={
                isLoading ||
                !fileUploaded ||
                (fileUploaded && !form.getValues("apiKey")) ||
                fileUploaded.status !== "processed"
              }
            >
              Deploy Model
            </Button>
            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
          </div>
          <FormMessage>
            {form?.formState?.errors?.promptItems?.root?.message}
          </FormMessage>
          {fileUploaded && (
            <div className="p-4 rounded-2xl bg-primary-foreground flex flex-col gap-2 my-4 text-primary text-sm border border-primary/30">
              <p className="font-bold underline underline-offset-2 text-lg">
                Recently uploaded file
              </p>
              <p>
                <b>File ID</b>: {fileUploaded.id}
              </p>
              <p>
                <b>Name</b>: {fileUploaded.filename}
              </p>
              <p>
                <b>Size</b>: {fileUploaded.bytes} bytes
              </p>
              <p className="capitalize">
                <b>Status</b>: {fileUploaded.status}
              </p>

              <Button onClick={handleRefreshUploadStatus} disabled={isLoading}>
                Refresh Status
              </Button>
            </div>
          )}

          {finetuningDeployed && (
            <div className="p-4 rounded-2xl bg-primary-foreground flex flex-col gap-2 my-4 text-primary text-sm border border-primary/30">
              <p className="font-bold underline underline-offset-2 text-lg">
                Recently deployed fine-tuning job
              </p>
              <p>
                <b>Job ID</b>: {finetuningDeployed?.id}
              </p>
              <p>
                <b>Default Model</b>: {finetuningDeployed?.model}
              </p>
              <p>
                <b>Fine-tuned Model Name</b>:{" "}
                {finetuningDeployed?.fine_tuned_model ?? "Still processing."}
              </p>
              <p className="capitalize">
                <b>Status</b>: {finetuningDeployed?.status}
              </p>
              <p>
                <b>Training File</b>: {finetuningDeployed?.training_file}
              </p>
              <p>
                <b>Organization ID</b>: {finetuningDeployed?.organization_id}
              </p>
              <Button
                onClick={handleRefreshDeployedStatus}
                disabled={isLoading}
              >
                Refresh Status
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default ManualInput;
