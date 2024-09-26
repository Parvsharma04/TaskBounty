"use client"; // Client Component

import { WORKER_URL } from "@/utils";
import { useRouter } from "next/navigation";

const WorkerActions = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(WORKER_URL);
      }}
      className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4"
    >
      Create Worker Account
    </button>
  );
};

export default WorkerActions;
