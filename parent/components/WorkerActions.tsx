"use client"; // Client Component

import { WORKER_URL } from "@/utils";

const WorkerActions = () => {
  return (
    <a
      href={WORKER_URL}
      target="_blank"
      className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4"
    >
      Create Worker Account
    </a>
  );
};

export default WorkerActions;
