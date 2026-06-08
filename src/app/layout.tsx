
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import AutoRefresh from "@/components/AutoRefresh";
import { APP_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: 'FC Frota | Gestão Inteligente de Logística',
  description: 'Sistema premium de gestão de frotas e transporte para FC Construções e Transportes.',
  icons: {
    icon: `/icon.png?v=${APP_VERSION}`,
    shortcut: `/icon.png?v=${APP_VERSION}`,
    apple: `/icon.png?v=${APP_VERSION}`,
    other: [
      { rel: 'manifest', url: '/manifest.json' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
        <link rel="icon" href={`/icon.png?v=${APP_VERSION}`} />
        <link rel="shortcut icon" href={`/icon.png?v=${APP_VERSION}`} />
        <link rel="apple-touch-icon" href={`/icon.png?v=${APP_VERSION}`} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          <AutoRefresh />
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
