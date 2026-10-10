import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title:"Namrata Dahal | Nursing, Education & Student-Life Creator",
 description:"Meet Namrata Dahal, a BSc Nursing student and Nepali creator. Explore education content, student stories, selected brand collaborations, and partnership opportunities.",
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "namrata-dahal-creator.satinypearl4.chatgpt.site"}`),
 openGraph:{title:"Namrata Dahal — Real stories. Real connection.",description:"Nursing, education and student-life content from Pokhara, Nepal.",images:["/images/editorial-portrait.png"],type:"website"},
 icons:{icon:"/favicon.svg"}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
