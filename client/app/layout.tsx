import NavBar from "@/components/Appbar";
import FooterPage from "@/components/Footer";
import { Wallet } from "./wallet/Wallet";
import type { Metadata } from "next";
import { Baloo_Bhai_2, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const myFont = localFont({
  src: "../fonts/GiuliaDEMO-Bold.otf",
  variable: "--myFont",
});
export const myFont2 = localFont({
  src: "../fonts/GiuliaPlainDEMO-Bold.otf",
  variable: "--myFont2",
});
export const myFont3 = Baloo_Bhai_2({
  subsets: ["latin"],
  variable: "--myFont3",
});

export const metadata: Metadata = {
  title: "User-TaskBounty",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${myFont.variable} ${myFont2.variable} ${myFont3.variable} bg-gray-950 text-white`}
      >
        <Wallet>
          <NavBar />
          {children}
          <FooterPage />
        </Wallet>
      </body>
    </html>
  );
}
