import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenAI Opensource Fine-tuning Model Creator",
  description:
    "An opensource tool to build and deploy your own OpenAI fine-tuning model.",
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
        </main>
      </body>
    </html>
  );
}
