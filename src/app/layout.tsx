import type { Metadata } from "next";
import "./globals.css";
import "@/styles/retro.css";

export const metadata: Metadata = {
  title: "Jarvis · OpenClaw — Centro de operaciones",
  description:
    "Interfaz retro pixel-art para controlar y observar al agente Jarvis conectado a OpenClaw.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-pixel antialiased">{children}</body>
    </html>
  );
}
