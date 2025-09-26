// src/app/layout.js
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { WalletProvider } from "../providers/WalletProvider";

export const metadata = {
  title: "CipherHealth — Starter",
  description: "Frontend for CipherHealth dApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
