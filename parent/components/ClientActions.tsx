"use client"; // Client Component

import { CLIENT_URL } from "@/utils";
import { useRouter } from "next/navigation";

const ClientActions = () => {
  const router = useRouter();

  return (
    <a
      href={CLIENT_URL}
      target="_blank"
      className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4"
    >
      Create Client Account
    </a>
  );
};

export default ClientActions;
