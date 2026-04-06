import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Literata } from "next/font/google";
import "@/styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: {
    default: "Tome — Read the books that shaped the world",
    template: "%s | Tome",
  },
  description:
    "The gamified platform for classical literature. 500+ public domain books with AI-guided reading, quizzes, and book clubs.",
  keywords: [
    "classical literature",
    "reading app",
    "public domain books",
    "gamified reading",
    "book clubs",
  ],
  authors: [{ name: "Tome" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tome",
    title: "Tome — Read the books that shaped the world",
    description:
      "The gamified platform for classical literature. Guided by Virgil.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tome — your digital reading companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tome — Read the books that shaped the world",
    description:
      "The gamified platform for classical literature. Guided by Virgil.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
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
      className={`dark ${plusJakartaSans.variable} ${literata.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body>{children}</body>
    </html>
  );
}
