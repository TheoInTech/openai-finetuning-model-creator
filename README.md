# OpenAI File-tuning Model Builder and Deployer

![OpenAI File-tuning Model Builder and Deployer Screenshot](https://openai-finetuning-model-creator.vercel.app/screenshot.png)

Welcome to the AI Fine-Tuning Builder! This tool is designed for people who want to customize their own AI models without dealing with complicated code. Everything you need can be done right from this user-friendly web interface.

## 🌟 Features

### 🔒 Safe and Easy-to-Use

- You only need to provide your API key once, and we'll take care of the rest.
- Note that we don't save any of your form data or API key on a database. You can check out the codebase of this opensource project above.
- Everything is sent over a secure https connection.

### 📤 File Upload or Manual Entry

- You can enter multiple prompts or dialogues to fine-tune your AI.
- (coming soon) You can either upload your data in a simple CSV file format or type it in yourself.

### 🚀 Quick Deployment

- Our tool will prepare your data and send it to OpenAI for fine-tuning.
- You'll get a quick status update, letting you know if everything went well.

## 🛠 How To Use

1. **Fill in the Details**: Put in your API key, choose the AI model you want, and upload or type in your prompts for system context, user and assistant response. It's like creating a monologue of your desired response from a context and user input.
2. **Click 'Upload File'**: This will upload the file or form to OpenAI's API for validation since they have strict formatting that we have to comply with.
3. **Check 'Uploaded File Status'**: Hit refresh on the file uploaded box so you can check its status. Once it's "processed", you can start deploying it.
4. **Click 'Deploy Model'**: This will start deploying your uploaded file to OpenAI and create a job for your fine-tuned model. This may take some time from a few minutes to a couple of hours.
5. **Check 'Job Deployment Status'**: Hit refresh on the job deployment box so you can check its status. Check OpenAI's playground and see if your fine-tuned model is there already.

## 🙌 Support Me

Found this tool helpful? You can [buy me a coffee](https://www.buymeacoffee.com/_theindiehacker) or visit my [website](https://theindiehackers.tech) to learn more about what I do!

---

Built with 💩 by [The Indie Hacker](https://theindiehackers.tech)
