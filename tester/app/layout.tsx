// layout.tsx or _app.tsx
import NavBar from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";
import StyledComponentsRegistry from "@/libs/registry";
import type { Metadata } from "next";
import "./globals.css";
import { GlobalStyles } from "./GlobalStyles";
import { Providers } from "./providers"; // Adjust the path if necessary

export const metadata: Metadata = {
  title: "Tester-TaskBounty",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        <GlobalStyles />
        <StyledComponentsRegistry>
          <Wallet>
            <NavBar />
            <Providers>{children}</Providers>
          </Wallet>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
