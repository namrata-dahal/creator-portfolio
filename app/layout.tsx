import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Namrata Dahal | Nursing, Education & Student-Life Creator",
  description:
    "Meet Namrata Dahal, a BSc Nursing student and Nepali creator. Explore education content, student stories, selected brand collaborations, and partnership opportunities.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "namrata-dahal-creator.satinypearl4.chatgpt.site"}`,
  ),
  openGraph: {
    title: "Namrata Dahal — Real stories. Real connection.",
    description:
      "Nursing, education and student-life content from Pokhara, Nepal.",
    images: ["/images/editorial-portrait.png"],
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f7f2",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
