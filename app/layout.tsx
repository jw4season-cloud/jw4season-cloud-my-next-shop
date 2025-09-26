import "./globals.css";

export const metadata = { title: "my-next-shop" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
