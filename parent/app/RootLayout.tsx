import Navbar from "@/components/Navbar";
// import { geistMono, geistSans } from "./layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`  antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
