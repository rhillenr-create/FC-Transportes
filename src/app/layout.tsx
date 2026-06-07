
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

export const metadata: Metadata = {
  title: 'FC Frota | Gestão Inteligente de Logística',
  description: 'Sistema premium de gestão de frotas e transporte para FC Construções e Transportes.',
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
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
