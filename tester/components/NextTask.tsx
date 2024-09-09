"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

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

interface NextTaskProps {
  noMoreTasks: boolean;
  setNoMoreTasks: Dispatch<SetStateAction<boolean>>;
}

export const NextTask: React.FC<NextTaskProps> = ({
  noMoreTasks,
  setNoMoreTasks,
}) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  // const [submitting, setSubmitting] = useState(false);s
  const wallet = useWallet();
  const router = useRouter();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
    } else {
      getTask();
    }
  }, [wallet]);

  const getTask = async () => {
    if (wallet.connected && token) {
      console.log("wallet connected");
      setLoading(true);
      try {
        let response = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
          headers: {
            Authorization: token,
          },
        });
        // console.log(response);
        setCurrentTask(response.data.task);
        setNoMoreTasks(false);
      } catch (error: any) {
        console.log(error);
        console.log(error.response.data.message);
        setCurrentTask(null);
        setNoMoreTasks(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {!wallet.connected ? (
        <div className="h-screen flex justify-center flex-col">
          <div className="w-full flex justify-center text-2xl">
            Please connect your wallet
          </div>
        </div>
      ) : loading ? (
        <div className="h-screen flex justify-center flex-col">
          <div className="w-full flex justify-center text-2xl">
            {/* Loading Bounty... */}<LoadingSpinner/>
          </div>
        </div>
      ) : currentTask === null ? (
        (!noMoreTasks && getTask(),
        (
          <div className="h-screen flex justify-center flex-col">
            <div className="w-full flex justify-center text-2xl">
              Please check back in some time, there are no pending bounties at
              the moment.
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="text-2xl pt-20 flex justify-center">
            {currentTask?.title}
          </div>
          <div className="flex justify-center pt-8">
            {currentTask?.options.map((option) => (
              <Option
                onSelect={async () => {
                  setLoading(true);
                  try {
                    const response = await axios.post(
                      `${BACKEND_URL}/v1/worker/submission`,
                      {
                        taskId: currentTask.id.toString(),
                        selection: option.id.toString(),
                      },
                      {
                        headers: {
                          Authorization: token, // Ensure this format is what your backend expects
                        },
                      }
                    );
                    if (response.status === 200) {
                      toast.success("task completed successfully");
                    }
                    const nextTask = response.data.nextTask;
                    if (nextTask) {
                      setCurrentTask(nextTask);
                    } else {
                      setCurrentTask(null);
                      setNoMoreTasks(true);
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
                  setLoading(false);
                }}
                key={option.id}
                imageUrl={option.image_url}
              />
            ))}
          </div>
        </div>
      )}
    </>
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
