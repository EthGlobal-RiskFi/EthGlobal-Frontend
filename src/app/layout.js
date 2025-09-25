import "../styles/globals.css";

export const metadata = {
  title: "CipherHealth — Starter",
  description: "Frontend starter for CipherHealth dApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
