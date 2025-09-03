import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import ChatbotProvider from "../components/ChatbotProvider";
import ThemeProvider from "../components/ThemeProvider";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BMS - Système de Gestion des Offres",
  description: "Plateforme de gestion intelligente des offres commerciales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <ChatbotProvider>
              {children}
            </ChatbotProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Composant de gestion d'erreur simple
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
