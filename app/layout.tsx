import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit, Montserrat, Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "SiteSage - Automated SEO Performance Analyzer",
  description: "Analyze website URLs for SEO and performance quality with AI-powered insights",
  authors: [{ name: "Samuel Masih" }],
  creator: "Samuel Masih",
  icons: {
    icon: "/gemini.png",
    apple: "/gemini.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} ${inter.variable} ${montserrat.variable} ${geist.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
