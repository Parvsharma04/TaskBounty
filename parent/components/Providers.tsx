import { NextUIProvider } from "@nextui-org/react";
import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
