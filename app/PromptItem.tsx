import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface PromptItemProps {
  system: string;
  user: string;
  assistant: string;
  index: number;
}

const PromptItem = ({ system, user, assistant, index }: PromptItemProps) => {
  return (
    <>
      <FormField
        name={"system"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>System</FormLabel>
            <FormControl>
              <Textarea {...field} value={system} className="resize-none" />
            </FormControl>
            <FormDescription>
              Usually called the &apos;context&apos; of your prompt.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={"user"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>User</FormLabel>
            <FormControl>
              <Textarea {...field} value={user} className="resize-none" />
            </FormControl>
            <FormDescription>
              This is where your user&apos; prompts and details should go.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={"assistant"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assistant</FormLabel>
            <FormControl>
              <Textarea {...field} value={assistant} className="resize-none" />
            </FormControl>
            <FormDescription>
              This will be the response you&apos;d want the AI to be trained
              for, based on your system context and user prompt.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PromptItem;
