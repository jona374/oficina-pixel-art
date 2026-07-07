import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import "@/styles/retro.css";

/* Tipografías del design system:
   - Press Start 2P: títulos, labels, UI (pixel auténtica).
   - VT323: consola/terminal (CRT clásica, muy legible en tamaños grandes). */
const fontTitle = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
  fallback: ["Courier New", "monospace"],
});

const fontTerminal = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-terminal",
  fallback: ["Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "Jarvis · OpenClaw — Centro de operaciones",
  description:
    "Interfaz retro pixel-art para controlar y observar al agente Jarvis conectado a OpenClaw.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontTitle.variable} ${fontTerminal.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
