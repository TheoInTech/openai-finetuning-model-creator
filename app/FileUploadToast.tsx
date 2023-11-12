import Link from "next/link";

const FileUploadToast = () => {
  return (
    <>
      <p>
        <b>Your fine-tuning file is now being uploaded.</b> The upload process
        usually takes a couple of minutes so please be patient. Try the deploy
        button from time to time.
      </p>
      <hr className="my-4" />
      <p>
        If this tool helped you, please consider giving a{" "}
        <Link
          href={"https://github.com/theointech/openai-finetuning-model-creator"}
          target="_blank"
          className="text-blue-500 hover:underline hover:underline-offset-2"
        >
          ⭐ on github
        </Link>{" "}
        or{" "}
        <Link
          href={"https://www.buymeacoffee.com/theointech"}
          target="_blank"
          className="text-blue-500 hover:underline hover:underline-offset-2"
        >
          buy me a coffee ☕
        </Link>
      </p>
    </>
  );
};

export default FileUploadToast;
