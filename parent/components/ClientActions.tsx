"use client"; // Client Component

import { CLIENT_URL } from "@/utils";
import { useRouter } from "next/navigation";

const ClientActions = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(CLIENT_URL);
      }}
      className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4"
    >
      Create Client Account
    </button>
  );
};

export default ClientActions;
