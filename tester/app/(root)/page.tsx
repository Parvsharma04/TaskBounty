"use client";

import NavBar from "@/components/Appbar";
import { NextTask } from "@/components/NextTask";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState("");

  return (
    <div>
      <NavBar setToken={setToken} />
      <NextTask token={token} />
    </div>
  );
}
