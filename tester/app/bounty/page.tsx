"use client";

import { NextTask } from "@/components/NextTask";
import { useState } from "react";

const Bounty = () => {
  const [noMoreTasks, setNoMoreTasks] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
      <div className="w-full">
        <NextTask noMoreTasks={noMoreTasks} setNoMoreTasks={setNoMoreTasks} />
      </div>
    </div>
  );
};

export default Bounty;
