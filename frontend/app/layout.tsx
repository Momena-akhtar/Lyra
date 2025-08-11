import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppinsBold = Poppins({
  variable: "--font-poppins-bold",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bella AI",
  description: "AI calls and texts leads instantly to convert them",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
        shortcut: "/logo.png",
        other: {
            rel: "icon",
            url: "/logo.png",
        },
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppinsBold.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
