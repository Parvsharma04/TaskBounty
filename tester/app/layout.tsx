import NavBar from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";
import StyledComponentsRegistry from "@/libs/registry";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { GlobalStyles } from "./GlobalStyles";
import { Providers } from "./providers";

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
        <ToastContainer
          position="top-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
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
