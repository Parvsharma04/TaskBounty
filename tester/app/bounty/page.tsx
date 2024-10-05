"use client";

import { NextTask } from "@/components/NextTask";
import { useState } from "react";

const Bounty = () => {
  const [noMoreTasks, setNoMoreTasks] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        <NextTask noMoreTasks={noMoreTasks} setNoMoreTasks={setNoMoreTasks} />
      </div>
    </div>
  );
};

export default Bounty;
