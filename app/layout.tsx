import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppViewport } from "@/components/shared/app-viewport";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yessay.matsveiyakubovich.com"),
  title: {
    default: "Yessay: AI Essay Checker",
    template: "%s | Yessay",
  },
  description:
    "Check your essay against the assignment prompt and rubric before you submit.",
  openGraph: {
    siteName: "Yessay",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/images/yessay-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Navbar />
        <AppViewport>{children}</AppViewport>
      </body>
    </html>
  );
}
