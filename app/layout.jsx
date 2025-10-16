// import React from "react";
// import { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
// import { Analytics } from "@vercel/analytics/next";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Navigation } from "@/components/navigation";
// import { Suspense } from "react";
// import { Toaster } from "@/components/ui/toaster"
// import BackgroundContent from '@/components/BackgroundContent'
// import "./globals.css";
// import LoadingComponent from "@/components/LoadingComponent";
// import Footer from "@/components/footer"

// export const metadata = {
//   title: "Ultra Band Music - Professional Live Music",
//   description:
//     "Professional live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
//   generator: "Oramzy",
// };

// export default function RootLayout({
//   children,
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <Suspense fallback={<LoadingComponent />}>
//           <BackgroundContent />
//             <Navigation />
//             <main className="min-h-screen">{children}</main>
//             <Footer />
//           </Suspense>
//           <Toaster />
//         </ThemeProvider>
//         <Analytics />
//       </body>
//     </html>
//   );
// }

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Ultra Band Music - Owambe Maestros",
  description:
    "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
  generator: "Oramzy",
  openGraph: {
    title: "Ultra Band Music - Professional Live Music",
    description: "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
    url: "https://ultra-band.vercel.app",
    images: [
      {
        url: "https:/ultra-band.vercel.app/meta-image.jpg",
        width: 1064,
        height: 651,
        alt: "Ultra Band Music Preview",
      },
    ],
    siteName: "Vendora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultra Band Music - Owambe Maetros",
    description: "Live music band for weddings, corporate events, and special occasions. Book Ultra Band Music for unforgettable performances.",
    images: ["https:/ultra-band.app/meta-image.jpg"],
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
