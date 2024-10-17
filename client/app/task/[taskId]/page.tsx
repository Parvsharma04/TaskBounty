"use client";

import AnimatedModalTasks from "@/components/AnimatedModalTasks";
import LoadingPage from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import { BACKEND_URL } from "@/utils";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  interface CategoryDetails {
    Design_Title: string;
    Idea_Title: string;
    Youtube_Thumbnail_Title: string;
    title: string;
    Design_Description: string;
    Idea_Description: string;
    Description: string;
    Design_Url: string[];
    Idea_Images: string[];
    Youtube_Thumbnail_Images: string[];
    Images: string[];
    image_url: string[];
    Responses: any;
  }

  interface TaskDetailsProps {
    amount: String;
    category: string;
    done: boolean;
    postDate: number;
    postMonth: number;
    postYear: number;
    id: String;
  }

  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps>({
    amount: "",
    category: "",
    done: false,
    postDate: 0,
    postMonth: 0,
    postYear: 0,
    id: "",
  });
  const [submissions, setSubmissions] = useState([]);
  const [categoryDetails, setCategoryDetails] =
    useState<CategoryDetails | null>(null);
  interface VotingDetails {
    type: string;
  }
  const [votingDetails, setVotingDetails] = useState<VotingDetails | null>(
    null
  );
  const [votingTypeDetails, setVotingTypeDetails] = useState([]);
  const [customLoader, setCustomLoader] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [MaxVotes, setMaxVotes] = useState(0);
  const wallet = useWallet();
  const router = useRouter();
  const [particularVotingArr, setParticularVotingArr] = useState<
    {
      type: string;
      votes: number;
      taskOption: number;
    }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
      return; // Exit early if wallet is not connected
    }

    const fetchTaskDetails = async () => {
      try {
        const data = await getTaskDetails(taskId);
        setTaskDetails(data.taskDetails);
        setSubmissions(data.responses);
        setCategoryDetails(data.categoryDetails);
        setVotingDetails(data.votingDetails);
        setVotingTypeDetails(data.votingTypeDetails);

        if (data.categoryDetails) {
          setMaxVotes(data.categoryDetails.Responses.length - 1);
        }

        if (data.votingTypeDetails) {
          const newVotingArr = Object.entries(data.votingTypeDetails).map(
            ([key, value]: [string, any]) => ({
              type: value,
              votes: 0,
              taskOption: 0,
            })
          );
          setParticularVotingArr(newVotingArr);
        }

        if (!loaded) {
          setLoaded(true); // Mark as loaded
          setCustomLoader(false); // Disable loader
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    // Initial fetch
    fetchTaskDetails();

    // Start polling every 2 seconds
    const intervalId = setInterval(fetchTaskDetails, 2000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [taskId, wallet.connected, router]);

  async function getTaskDetails(taskId: string) {
    const response = await axios.get(
      `${BACKEND_URL}/v1/user/task?taskId=${taskId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  }

  const GudelinesArr = [categoryDetails?.Description ?? "No Description"];

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="bg-gray-800 text-white pt-10 px-5 pb-14 w-fit flex flex-col justify-center items-center gap-8 rounded-xl">
        {customLoader && <LoadingPage />}
        <AnimatedModalTasks
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Description"
        >
          <ul className="list-disc ml-4">
            {GudelinesArr.map((val, idx) => (
              <li key={idx}>{val}</li>
            ))}
          </ul>
        </AnimatedModalTasks>

        <div className="p-3 sm:p-4 mb-4 text-white bg-gray-850 rounded-2xl w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0 flex-wrap">
            <motion.div
              className="bg-gray-900 p-4 md:p-6 lg:p-8 rounded-2xl flex justify-center items-center flex-wrap w-full" // Add w-full here
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Accordion className="max-w-full w-full">
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  title={
                    <div className="flex justify-between">
                      <span className="text-white">
                        {taskDetails.category === "UI_UX_Design" &&
                          categoryDetails?.Design_Title}
                        {taskDetails.category === "Idea_Product" &&
                          categoryDetails?.Idea_Title}
                        {taskDetails.category === "Youtube_Thumbnail" &&
                          categoryDetails?.Youtube_Thumbnail_Title}
                        {taskDetails.category === "Miscellaneous" &&
                          categoryDetails?.title}
                        {taskDetails.category === "Data_Labelling" &&
                          categoryDetails?.title}
                      </span>
                      <Button
                        isIconOnly
                        color="default"
                        onPress={onOpen}
                        className="text-xl bg-slate-700 text-white"
                      >
                        ?
                      </Button>
                    </div>
                  }
                >
                  <div className="flex wrap gap-3">
                    <Chip color="default">
                      Task Date:{" "}
                      {new Date(
                        taskDetails?.postYear,
                        taskDetails?.postMonth,
                        taskDetails?.postDate
                      ).toLocaleDateString()}
                    </Chip>

                    <Chip color="secondary">
                      Amount:{" "}
                      {parseFloat(taskDetails?.amount.toString()) /
                        1000_000_000}{" "}
                      SOL
                    </Chip>

                    <Chip color="primary">{taskDetails?.category}</Chip>
                    <Chip color="success">
                      Task Status: {taskDetails?.done ? "Completed" : "Open"}
                    </Chip>
                    <Chip color="warning">MaxVotes: {MaxVotes}</Chip>
                  </div>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-5">
          {taskDetails.category === "UI_UX_Design" &&
            categoryDetails?.Design_Url.map((url, idx) => {
              return (
                <Task
                  key={idx}
                  imageUrl={url ?? ""}
                  amount={taskDetails?.amount}
                  type="website"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
          {taskDetails.category === "Idea_Product" &&
            categoryDetails?.Idea_Images.map((url, idx) => {
              return (
                <Task
                  amount={taskDetails?.amount}
                  key={idx}
                  imageUrl={url ?? ""}
                  type="image"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
          {taskDetails.category === "Youtube_Thumbnail" &&
            categoryDetails?.Youtube_Thumbnail_Images.map((url, idx) => {
              return (
                <Task
                  amount={taskDetails?.amount}
                  key={idx}
                  imageUrl={url ?? ""}
                  type="image"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
          {taskDetails.category === "Miscellaneous" &&
            categoryDetails?.Images.map((url, idx) => {
              return (
                <Task
                  amount={taskDetails?.amount}
                  key={idx}
                  imageUrl={url ?? ""}
                  type="image"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
          {taskDetails.category === "Miscellaneous" &&
            categoryDetails?.Design_Url.map((url, idx) => {
              return (
                <Task
                  amount={taskDetails?.amount}
                  key={idx}
                  imageUrl={url ?? ""}
                  type="website"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
          {taskDetails.category === "Data_Labelling" &&
            categoryDetails?.image_url.map((url, idx) => {
              return (
                <Task
                  amount={taskDetails?.amount}
                  key={idx}
                  imageUrl={url ?? ""}
                  type="image"
                  votes={MaxVotes}
                  category={taskDetails?.category ?? ""}
                  VotingType={votingDetails?.type ?? ""}
                  votingTypeDetails={particularVotingArr}
                  responses={categoryDetails?.Responses}
                  idx={idx}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function Task({
  amount,
  imageUrl,
  type,
  votes,
  category,
  VotingType,
  votingTypeDetails,
  responses,
  idx,
}: {
  amount: String;
  imageUrl: string;
  type: string;
  votes: number;
  category: string;
  VotingType: string;
  votingTypeDetails: any;
  responses: any;
  idx: number;
}) {
  return (
    <TaskCard
      amount={amount}
      imageUrl={imageUrl}
      votes={votes}
      type={type}
      category={category}
      VotingType={VotingType}
      votingTypeDetails={votingTypeDetails}
      responses={responses}
      idx={idx}
    />
  );
}
