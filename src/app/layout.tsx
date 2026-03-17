import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Sans } from "next/font/google";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "6POINT Solutions | Marketing That Actually Grows Your Business",
  description:
    "We help businesses scale with powerful branding, modern websites, and performance-driven marketing strategies.",
  icons: {
    icon: "/d2b8263f-f484-4783-8fd0-daf49e85220b.png",
    apple: "/d2b8263f-f484-4783-8fd0-daf49e85220b.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <PageLoader />
        <PageTransition />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
