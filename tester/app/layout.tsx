import NavBar from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tester-TaskBounty",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Wallet>
          <NavBar />
          {children}
        </Wallet>
      </body>
    </html>
  );
}
