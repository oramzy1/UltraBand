import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "UltraBand Entertainment",
  description:
    "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
  generator: "Oramzy",
  openGraph: {
    title: "UltraBand Entertainment ",
    description: "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
    url: "https://ultrabandentertainment.com",
    images: [
      {
        url: "https://ultrabandentertainment.com/meta-image.jpg",
        width: 1064,
        height: 651,
        alt: "Ultra Band Music Preview",
      },
    ],
    siteName: "Ultraband Entertainment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UltraBand Entertainment",
    description: "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
    images: ["https://ultrabandentertainment.com/meta-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
