"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";
import TaskImage from "./TaskImage";
import TaskStatement from "./TaskStatement";

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
      setLoading(true);
      try {
        let response = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
          headers: {
            Authorization: token,
          },
        });
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
            <LoadingSpinner />
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
        <div className="flex justify-center h-screen items-center">
          <div className="bg-gray-500 border-1px border-gray-100 p-10 w-fit rounded-2xl h-fit">
            <div className="flex justify-center">
              <TaskStatement taskTitle={currentTask.title} />
            </div>
            <div className="flex justify-center  gap-5 pt-8">
              {currentTask?.options.map((option) => (
                <TaskImage
                  onSelect={async () => {
                    let d = new Date();
                    let currDate = d.getUTCDate();
                    let currMonth = d.getUTCMonth();
                    let currYear = d.getUTCFullYear();
                    setLoading(true);
                    try {
                      const response = await axios.post(
                        `${BACKEND_URL}/v1/worker/submission`,
                        {
                          taskId: currentTask.id.toString(),
                          selection: option.id.toString(),
                          postDate: currDate,
                          postMonth: currMonth,
                          postYear: currYear,
                        },
                        {
                          headers: {
                            Authorization: token,
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
                    } catch (err) {
                      if (axios.isAxiosError(err)) {
                        console.error(
                          "Error fetching next task:",
                          err.response?.data || err.message
                        );
                      } else {
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
        </div>
      )}
    </>
  );
};
