"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  amount: number;
  title: string;
  options: {
    id: number;
    image_url: string;
    task_id: number;
  }[];
}

export const NextTask = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { publicKey, disconnect } = useWallet();
  let token = localStorage.getItem("token");

  useEffect(() => {
    async function getTask() {
      try {
        if (!token) {
          return new Error("token not found");
        }
        let response = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
          headers: {
            Authorization: token || localStorage.getItem("token"),
          },
        });

        console.log(response.data);
        setCurrentTask(response.data.task);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
      setLoading(false);
    }

    if (publicKey) {
      getTask();
    }
  }, [publicKey, localStorage.getItem("token")]);
  useEffect(() => {
    if (!publicKey) {
      localStorage.removeItem("token");
      setLoading(true);
    }
  }, [publicKey, disconnect]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center flex-col">
        {token ? (
          <div className="w-full flex justify-center text-2xl">Loading...</div>
        ) : (
          <div className="w-full flex justify-center text-2xl">
            Please connect your wallet
          </div>
        )}
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="h-screen flex justify-center flex-col">
        <div className="w-full flex justify-center text-2xl">
          Please check back in some time, there are no pending tasks at the
          moment
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl pt-20 flex justify-center">
        {currentTask.title}
        <div className="pl-4">{submitting && "Submitting..."}</div>
      </div>
      <div className="flex justify-center pt-8">
        {currentTask.options.map((option) => (
          <Option
            onSelect={async () => {
              setSubmitting(true);
              try {
                const response = await axios.post(
                  `${BACKEND_URL}/v1/worker/submission`,
                  {
                    taskId: currentTask.id.toString(),
                    selection: option.id.toString(),
                  },
                  {
                    headers: {
                      Authorization: `${localStorage.getItem("token")}`, // Ensure this format is what your backend expects
                    },
                  }
                );

                const nextTask = response.data.nextTask;
                if (nextTask) {
                  setCurrentTask(nextTask);
                } else {
                  setCurrentTask(null);
                }
                // Refresh the user balance in the appbar
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  // Handle Axios errors
                  console.error(
                    "Error fetching next task:",
                    err.response?.data || err.message
                  );
                } else {
                  // Handle non-Axios errors
                  console.error("Unexpected error:", err);
                }
                setCurrentTask(null);
              }
              setSubmitting(false);
            }}
            key={option.id}
            imageUrl={option.image_url}
          />
        ))}
      </div>
    </div>
  );
};

function Option({
  imageUrl,
  onSelect,
}: {
  imageUrl: string;
  onSelect: () => void;
}) {
  return (
    <div>
      <img
        onClick={onSelect}
        className={"p-2 w-96 rounded-md cursor-pointer"} // Added cursor-pointer for better UX
        src={imageUrl}
        alt="Option" // Added alt text for better accessibility
      />
    </div>
  );
}
