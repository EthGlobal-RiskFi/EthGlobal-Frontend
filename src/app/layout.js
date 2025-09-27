// src/app/layout.js
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from  "../components/Footer";
import { WalletProvider } from "../providers/WalletProvider";

export const metadata = {
  title: "RobinHood — Starter",
  description: "Frontend for RobinHood dApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <WalletProvider>
        <Navbar />
          {children}
        <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
