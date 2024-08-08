import RainbowProvider from "@/providers/rainbow-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/old_components/header";
import Footer from "@/old_components/footer";
import TalismanProvider from "@/providers/talisman-provider";
import TransferProvider from "@/providers/transfer-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Darwinia Paralink",
  description: "A user-friendly UI for XCM token transfers across various parachains.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-app-black text-base font-normal text-white`}>
        <RainbowProvider>
          <TalismanProvider>
            <TransferProvider>
              <Header />
              {children}
              <Footer />
            </TransferProvider>
          </TalismanProvider>
        </RainbowProvider>
      </body>
    </html>
  );
}
