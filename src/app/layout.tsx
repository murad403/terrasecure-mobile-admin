import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import ReduxWrapper from "@/components/wrapper/ReduxWrapper";
import { Toaster } from "sonner";

const sora = Sora({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sora"
});

export const metadata: Metadata = {
  title: "Terrasecure Mobile Admin",
  description: "Terrasecure Mobile Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.className} h-full antialiased`}
    >
      <ReduxWrapper>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </body>
      </ReduxWrapper>
    </html>
  );
}
