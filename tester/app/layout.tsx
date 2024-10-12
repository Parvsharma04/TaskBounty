"use client"

import NavBar from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";
import StyledComponentsRegistry from "@/libs/registry";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { GlobalStyles } from "./GlobalStyles";
import { Providers } from "./providers";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { metadata } from "./metadata";

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
        <Provider store={store}>
          <Wallet>
            <NavBar />
            <Providers>{children}</Providers>
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
          </Wallet>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
