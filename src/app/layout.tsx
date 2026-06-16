import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ReduxWrapper from "@/components/wrapper/ReduxWrapper";

const roboto = Roboto({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
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
      className={`${roboto.variable} h-full antialiased`}
    >
      <ReduxWrapper>
        <body className="min-h-full flex flex-col">{children}</body>
      </ReduxWrapper>
    </html>
  );
}
