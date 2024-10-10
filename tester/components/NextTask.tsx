"use client";

import { BACKEND_URL, NextTaskProps, Task } from "@/utils";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import { TaskOptions } from "./task/TaskCategory";
import TaskStatement from "./TaskStatement";

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
  const [limitReached, setLimitReached] = useState(false);
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
        if (response.data.message) setLimitReached(true);
        // console.log(response.data);
        setCurrentTask(response.data.task);
        setNoMoreTasks(false);
      } catch (error: any) {
        if (error.status === 423) {
          setLimitReached(true);
        }
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
    } catch (err: any) {
      console.error("Error submitting task:", err);

      if (err.response && err.response.status === 409) {
        toast.error(err.response.data.message); // Display the error message from the server
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }

      setCurrentTask(null);
    }
    setLoading(false);
  };
  const handleTaskVoteOptionSelect = (idx: number) => {
    setTaskVoteOptionSelect(idx);
  };
  const handleTaskOptionSelect = (idx: number) => {
    setTaskOptionSelect(idx);
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
      <div className="min-h-screen bg-black text-white mt-16 sm:mt-0 w-full">
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
        ) : limitReached ? (
          <div className="h-screen flex justify-center items-center px-4">
            <div className="text-center text-lg sm:text-xl md:text-2xl">
              You have completed your 5 bounties for today. Come back tomorrow
              for more.
            </div>
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
          <div className="flex flex-col flex-wrap w-full justify-center items-center min-h-screen md:px-20 md:pt-24 px-10 pt-16">
            <motion.div
              className="flex flex-wrap md:flex-nowrap justify-center gap-4 sm:gap-6 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <motion.div
                className="bg-gray-900 p-4 md:p-6 lg:p-8 rounded-2xl flex justify-center items-center flex-wrap"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                {currentTask.description ? (
                  <Accordion>
                    <AccordionItem
                      title={
                        <TaskStatement
                          category={currentTask.category}
                          title={currentTask.title}
                          name="Bounty :"
                        />
                      }
                    >
                      {currentTask.description}
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <TaskStatement
                    category={currentTask.category}
                    title={currentTask.title}
                    name="Bounty :"
                  />
                )}

                <motion.ul
                  className="flex flex-wrap gap-4 sm:gap-5 md:pl-4 mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {currentTask?.options && currentTask.options.length > 0 ? (
                    currentTask.options.map((option) => (
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
                    ))
                  ) : (
                    <div className="text-center text-lg">
                      No options available for this task.
                    </div>
                  )}
                </motion.ul>
              </motion.div>

              {currentTask?.category !== "Youtube_Thumbnail" && (
                <motion.div
                  className="bg-gray-900 p-4 md:p-6 lg:p-8 rounded-2xl flex flex-col justify-between items-center h-[26.6rem]"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <TaskStatement
                    category="Voting"
                    title="Options: Your Voice, Your Rating"
                    name={null}
                  />
                  <motion.ul
                    className="flex flex-wrap gap-4 sm:gap-5 mt-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {currentTask?.votingTypeDetails &&
                      Object.entries(currentTask.votingTypeDetails)
                        .slice(1)
                        .map((val, idx) => (
                          <motion.li
                            key={idx}
                            variants={itemVariants}
                            className="flex justify-start items-center text-lg sm:text-xl w-full bg-gray-700 rounded-md p-2 hover:bg-gray-800 cursor-pointer transition-colors relative"
                            onClick={() => handleTaskVoteOptionSelect(idx)}
                          >
                            <input
                              id={`default-checkbox-${idx}`}
                              type="checkbox"
                              name="default-checkbox"
                              value="1"
                              checked={taskVoteOptionSelect === idx}
                              onChange={() => handleTaskVoteOptionSelect(idx)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                            />
                            <label
                              htmlFor={`default-checkbox-${idx}`}
                              className="ml-2"
                            >
                              {`${val[1]}`}
                            </label>
                          </motion.li>
                        ))}
                  </motion.ul>
                </motion.div>
              )}
            </motion.div>

            <div className="m-5">
              <motion.button
                onClick={handleSubmit}
                className="wallet-adapter-button-trigger p-4 w-32 bg-blue-600 rounded-[20px] shadow-lg text-lg transition-all duration-300 ease-in-out hover:bg-blue-500 hover:shadow-xl"
                initial={{ scale: 1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Submit
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
