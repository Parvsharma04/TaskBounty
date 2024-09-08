"use client";

import { NextTask } from "@/components/NextTask";
import { useState } from "react";

const EarnByTask = () => {
  const [noMoreTasks, setNoMoreTasks] = useState(false);

  return (
    <div>
      <NextTask noMoreTasks={noMoreTasks} setNoMoreTasks={setNoMoreTasks} />
    </div>
  );
};

export default EarnByTask;
