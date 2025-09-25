// src/app/layout.js
import "../styles/globals.css";
import ReownProvider from "../providers/ReownProvider";

export const metadata = {
  title: "CipherHealth — Starter",
  description: "Frontend starter for CipherHealth dApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  );
}
