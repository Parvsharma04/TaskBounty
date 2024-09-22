"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
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

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const NextTask: React.FC<NextTaskProps> = ({
  noMoreTasks,
  setNoMoreTasks,
}) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const router = useRouter();
  const token: String | null = localStorage.getItem("token");

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
      <div className="min-h-screen bg-black text-white p-4 mt-16 sm:mt-0">
        {!wallet.connected ? (
          <div className="h-screen flex justify-center items-center px-4">
            <div className="text-center text-lg sm:text-xl md:text-2xl">
              Please connect your wallet
            </div>
          </div>
        ) : loading ? (
          <div className="h-screen flex justify-center items-center">
            <Loading />
          </div>
        ) : currentTask === null ? (
          (!noMoreTasks && getTask(),
          (
            <div className="h-screen flex justify-center items-center px-4">
              <div className="text-center text-lg sm:text-xl md:text-2xl">
                Please check back in some time, there are no pending bounties at
                the moment.
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center min-h-screen md:p-5">
            <motion.div
              className="bg-gray-900 border p-4 sm:p-6 md:p-10 w-fit max-w-5xl rounded-2xl "
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div className="flex justify-center mb-4 sm:mb-6 ">
                <TaskStatement taskTitle={currentTask.title} />
              </div>
              <motion.ul
                className="flex flex-wrap gap-4 sm:gap-5 md: pl-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentTask?.options.map((option) => (
                  <motion.li
                    key={option.id}
                    variants={itemVariants}
                    className="flex justify-center"
                  >
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
                      imageUrl={option.image_url}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};
