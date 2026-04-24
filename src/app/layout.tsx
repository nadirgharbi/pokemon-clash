import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon Clash",
  description: "Pokemon Clash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("dark", "h-full", "antialiased", nunito.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" richColors />
        <div className="flex flex-col flex-1 py-32 px-16 gap-6">
          {children}
        </div>
      </body>
    </html>
  );
}
