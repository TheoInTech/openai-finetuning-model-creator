"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IPromptItem } from "@/types/form.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UseFormProps, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const promptItemSchema = z.object({
  system: z.string().min(1).nonempty(),
  user: z.string().min(1).nonempty(),
  assistant: z.string().min(1).nonempty(),
});

const formSchema = z
  .object({
    apiKey: z.string().nonempty("OpenAI API key is required"),
    promptItems: z.array(promptItemSchema),
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
  const [promptItems, setPromptItems] = useState<IPromptItem[]>([
    { system: "", user: "", assistant: "" },
  ]);

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    reset,
  } = useZodForm({
    schema: formSchema,
    defaultValues: { apiKey: "", promptItems: promptItems },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "promptItems",
    control,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      promptItems: promptItems,
    },
  });

  console.log("promptItems", promptItems);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8"
      >
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API key</FormLabel>
              <FormControl>
                <Input placeholder="sk-V8...tH3o" {...field} autoFocus />
              </FormControl>
              <FormDescription>
                We suggest you create one temporarily for the purpose of this
                tool. You can delete it later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => {
          const errorSystem = errors?.promptItems?.[index]?.system;
          const errorUser = errors?.promptItems?.[index]?.user;
          const errorAssistant = errors?.promptItems?.[index]?.assistant;

          console.log("errors", errors);
          return (
            <div key={field.id} className="flex flex-col gap-4">
              <FormField
                name={"system"}
                render={() => (
                  <FormItem>
                    <FormLabel>System</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={field.system}
                        {...register(`promptItems.${index}.system` as const)}
                      />
                    </FormControl>
                    <FormDescription>
                      Usually called the &apos;context&apos; of your prompt.
                    </FormDescription>
                    {errorSystem && (
                      <FormMessage>{errorSystem.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name={"user"}
                render={() => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={field.user}
                        {...register(`promptItems.${index}.user` as const)}
                      />
                    </FormControl>
                    <FormDescription>
                      This is where your user&apos; prompts and details should
                      go.
                    </FormDescription>
                    {errorUser && (
                      <FormMessage>{errorUser.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name={"assistant"}
                render={() => (
                  <FormItem>
                    <FormLabel>Assistant</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={field.assistant}
                        {...register(`promptItems.${index}.assistant` as const)}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the response you&apos;d want the AI to be
                      trained for, based on your system context and user prompt.
                    </FormDescription>
                    {errorAssistant?.message && (
                      <FormMessage>{errorAssistant.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <hr className="my-4" />
            </div>
          );
        })}

        <div className="flex justify-between">
          <Button
            variant={"secondary"}
            onClick={(e: any) => {
              e.preventDefault();
              append({
                system: "",
                user: "",
                assistant: "",
              });
            }}
            className="p-0"
          >
            <Plus className="mr-2" /> Add New Prompt Item
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualInput;
