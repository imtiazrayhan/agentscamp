import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Claude Code Agents - 60+ AI Development Assistants | AgentsCamp",
  description: "Discover 60+ specialized Claude Code agents for software development. Expert AI assistants for frontend, backend, DevOps, testing, and more. Start coding smarter with Claude Code agents today.",
  keywords: "Claude Code agents, AI development assistants, Claude AI programming, Anthropic Claude coding, AI code generation, Claude development tools, AI pair programming, Claude Code IDE",
  authors: [{ name: "AgentsCamp" }],
  openGraph: {
    title: "Claude Code Agents - Transform Your Development Workflow",
    description: "Access 60+ specialized Claude Code agents designed for every aspect of software development. From intelligent code generation to automated DevOps.",
    type: "website",
    url: "https://agentscamp.com",
    siteName: "AgentsCamp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claude Code Agents by AgentsCamp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Agents - 60+ AI Assistants for Developers",
    description: "Specialized Claude Code agents for every development task. Code faster, debug smarter, deploy confidently with AI-powered assistance.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
