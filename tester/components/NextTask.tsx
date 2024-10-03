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
import TaskOptions from "./task/TaskOptions";
import TaskStatement from "./TaskStatement";

interface Task {
  id: number;
  amount: string;
  category: string;
  title: string;
  options: {
    votingTypeDetails: any;
    id: number;
    image_url: string;
    task_id: number;
  }[];
  votingType: string;
  votingTypeDetails?: any;
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
  const token: string | null = localStorage.getItem("token");
  const [taskOptionSelect, setTaskOptionSelect] = useState(0);
  const [taskVoteOptionSelect, setTaskVoteOptionSelect] = useState(0);

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
        const response = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
          headers: {
            Authorization: token,
          },
        });
        setCurrentTask(response.data.task);
        setNoMoreTasks(false);
      } catch (error: any) {
        console.log(error);
        setCurrentTask(null);
        setNoMoreTasks(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    let d = new Date();
    let currDate = d.getUTCDate();
    let currMonth = d.getUTCMonth();
    let currYear = d.getUTCFullYear();
    setLoading(true);

    try {
      const amtString = currentTask?.amount.toString();
      const response = await axios.post(
        `${BACKEND_URL}/v1/worker/submission`,
        {
          taskId: currentTask?.id,
          amount: amtString,
          optionId: taskOptionSelect + 1,
          voteOptionId: taskVoteOptionSelect + 1,
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
        toast.success("Task completed successfully!");
      }
      const nextTask = response.data.nextTask;
      if (nextTask) {
        setCurrentTask(nextTask);
      } else {
        setCurrentTask(null);
        setNoMoreTasks(true);
      }
    } catch (err) {
      console.error("Error submitting task:", err);
      setCurrentTask(null);
    }
    setLoading(false);
  };
  const handleTaskVoteOptionSelect = (idx: number) => {
    setTaskVoteOptionSelect(idx); // Only the clicked checkbox will be selected
  };
  const handleTaskOptionSelect = (idx: number) => {
    setTaskOptionSelect(idx); // Only the clicked checkbox will be selected
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
          <div className="flex flex-col justify-center items-center min-h-screen md:p-5">
            <motion.div
              className="flex flex-wrap md:flex-nowrap justify-center gap-10 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <motion.div
                className="bg-gray-900 border p-4 sm:p-6 md:p-10 w-fit max-w-5xl rounded-2xl lg:mt-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <TaskStatement
                  category={currentTask.category}
                  title={currentTask.title}
                  name="Bounty :"
                />
                <motion.ul
                  className="flex flex-wrap gap-4 sm:gap-5 md:pl-12"
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
                      <TaskOptions
                        category={currentTask.category}
                        option={option}
                        taskOptionSelect={taskOptionSelect}
                        setTaskOptionSelect={setTaskOptionSelect}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
              <motion.div
                className="bg-gray-900 border p-4 sm:p-6 md:p-10 w-fit max-w-5xl rounded-2xl lg:mt-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <TaskStatement
                  category="Voting"
                  title="Options: "
                  name={null}
                />
                <motion.ul
                  className="flex flex-wrap gap-4 sm:gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.entries(currentTask?.votingTypeDetails)
                    ?.slice(1)
                    .map((val, idx) => (
                      <motion.li
                        key={idx}
                        variants={itemVariants}
                        className="flex justify-center items-center text-xl w-full bg-gray-700 rounded-md p-2 hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <input
                          id={`default-checkbox-${idx}`}
                          type="checkbox"
                          name="default-checkbox"
                          value="1"
                          checked={taskVoteOptionSelect === idx} // Checkbox is checked if this is the selected one
                          onChange={() => handleTaskVoteOptionSelect(idx)} // Update selected checkbox
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 absolute top-1/3 left-1/3 z-50"
                        />
                        <label
                          htmlFor={`default-checkbox-${idx}`}
                        >{`${val[1]}`}</label>
                      </motion.li>
                    ))}
                </motion.ul>
              </motion.div>
            </motion.div>
            <motion.div
              className="bg-gray-900 border p-3 px-5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors text-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <button onClick={handleSubmit}>Submit your vote</button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};
