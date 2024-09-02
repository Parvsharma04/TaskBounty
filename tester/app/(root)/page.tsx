"use client"

import Appbar from "@/components/Appbar";
import { NextTask } from "@/components/NextTask";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState('')

  return (
    <div>
      <Appbar setToken = {setToken}/>
      <NextTask token={token} setToken = {setToken}/>
    </div>
  );
}