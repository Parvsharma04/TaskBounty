"use client";

import { useServerInsertedHTML } from "next/navigation";
import React, { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    console.log("Inserting styles:", styles); // Debug log
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    return <>{children}</>; // Render children directly in the browser
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children} // Render children on the server with the stylesheet manager
    </StyleSheetManager>
  );
}
