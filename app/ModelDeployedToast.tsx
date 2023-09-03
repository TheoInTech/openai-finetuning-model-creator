import Link from "next/link";

const ModelDeployedToast = () => {
  return (
    <>
      <p>
        <b>Your fine-tuned model is now being deployed.</b> You will receive an
        email from OpenAI tied to your API key once it&apos;s done. The process
        usually takes a couple of hours so please be patient.
      </p>
      <hr className="my-4" />
      <p>
        If this tool helped you, please consider giving a{" "}
        <Link
          href={
            "https://github.com/theindiehacker/openai-finetuning-model-creator"
          }
          target="_blank"
          className="hover:underline hover:underline-offset-2 text-blue-500"
        >
          ⭐ on github
        </Link>{" "}
        or{" "}
        <Link
          href={"https://www.buymeacoffee.com/_theindiehacker"}
          target="_blank"
          className="hover:underline hover:underline-offset-2 text-blue-500"
        >
          buy me a coffee ☕
        </Link>
      </p>
    </>
  );
};

export default ModelDeployedToast;
