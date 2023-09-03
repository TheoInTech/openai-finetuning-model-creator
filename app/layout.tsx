import { Toaster } from "@/components/toaster";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenAI Opensource Fine-tuning Model Creator",
  description:
    "An opensource tool to build and deploy your own OpenAI fine-tuning model.",
  keywords: [
    "openai",
    "openai fine-tuning",
    "openai fine-tuning model",
    "openai fine-tuning model creator",
    "openai fine-tuning model builder",
    "openai fine-tuning model deployer",
    "openai api",
    "how to deploy openai fine-tuning model",
    "how to build openai fine-tuning model",
    "how to create openai fine-tuning model",
    "how to train openai fine-tuning model",
    "how to fine-tune openai fine-tuning model",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full h-full min-h-screen flex flex-col items-center">
          {children}
          <Toaster />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
