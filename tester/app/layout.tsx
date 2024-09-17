import NavBar from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";
import StyledComponentsRegistry from "@/libs/registry";
import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-black">
        <StyledComponentsRegistry>
          <Wallet>
            <NavBar />
            {children}
          </Wallet>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
