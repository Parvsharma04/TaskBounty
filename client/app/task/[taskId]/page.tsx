"use client";

import LoadingPage from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import { BACKEND_URL } from "@/utils";
import { Chip } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
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
    Responses: any;
  }
  interface TaskDetailsProps {
    amount: String;
    category: string;
    done: string;
    postDate: number;
    postMonth: number;
    postYear: number;
    id: String;
  }

  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps>({
    amount: "",
    category: "",
    done: "",
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
  const [votingTypeDetails, setVotingTypeDetails] = useState(null);
  const [customLoader, setCustomLoader] = useState(false);
  const [votingArr, setVotingArr] = useState<{ type: string; votes: number }[]>(
    []
  );
  const [MaxVotes, setMaxVotes] = useState(0);

  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected, router]);

  useEffect(() => {
    //! adding polling logic
    setCustomLoader(true);

    getTaskDetails(taskId).then((data) => {
      setTaskDetails(data.taskDetails);
      setSubmissions(data.responses);
      setCategoryDetails(data.categoryDetails);
      setVotingDetails(data.votingDetails);
      setVotingTypeDetails(data.votingTypeDetails);

      // for voting types
      {
        data.votingTypeDetails &&
          Object.entries(data.votingTypeDetails).forEach(
            (val: any, idx: number) => {
              return votingArr.push({
                type: val[1],
                votes: 0,
              });
            }
          );
      }
      // for voting count
      if (data.categoryDetails && data.categoryDetails.Responses) {
        for (let i = 1; i < data.categoryDetails.Responses.length; i++) {
          votingArr[data.categoryDetails.Responses[i].value].votes += 1;
          setMaxVotes((prevMaxVotes) =>
            Math.max(
              prevMaxVotes,
              votingArr[data.categoryDetails.Responses[i].value].votes
            )
          );
        }
      }
    });

    const timer = setTimeout(() => {
      getTaskDetails(taskId).then((data) => {
        setSubmissions(data.responses);
        setTaskDetails(data.taskDetails);
        setCategoryDetails(data.categoryDetails);
        setVotingDetails(data.votingDetails);
        setVotingTypeDetails(data.votingTypeDetails);
      });
    }, 5000);
    setCustomLoader(false);

    return () => {
      clearTimeout(timer);
    };
  }, [taskId]);

  async function getTaskDetails(taskId: string) {
    setCustomLoader(true);
    const response = await axios.get(
      `${BACKEND_URL}/v1/user/task?taskId=${taskId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    setCustomLoader(false);
    return response.data;
  }

  return (
    <div className="bg-gray-950 text-white h-screen w-full flex flex-col justify-center items-center">
      {customLoader && <LoadingPage />}
      <div className="capitalize font-semibold text-3xl flex justify-center items-center gap-2">
        {taskDetails.category == "UI_UX_Design" &&
          categoryDetails?.Design_Title}
        {taskDetails.category == "Idea_Product" && categoryDetails?.Idea_Title}
        {taskDetails.category == "Youtube_Thumbnail" &&
          categoryDetails?.Youtube_Thumbnail_Title}
        {taskDetails.category == "Miscellaneous" && categoryDetails?.title}
        <Chip color="primary">{taskDetails?.category}</Chip>
      </div>
      <div className="flex flex-wrap justify-center pt-8 gap-5">
        {taskDetails.category === "UI_UX_Design" &&
          categoryDetails?.Design_Url.map((url, idx) => (
            <Task
              amount={taskDetails?.amount}
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={MaxVotes}
              category={taskDetails?.category ?? ""}
              postDate={taskDetails?.postDate}
              postMonth={taskDetails?.postMonth}
              postYear={taskDetails?.postYear}
              TaskStatus={taskDetails?.done}
              VotingType={votingDetails?.type ?? ""}
              votingTypeDetails={votingArr}
            />
          ))}
        {taskDetails.category === "Idea_Product" &&
          categoryDetails?.Idea_Images.map((url, idx) => (
            <Task
              amount={taskDetails?.amount}
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Idea_Description ?? ""}
              votes={MaxVotes}
              category={taskDetails?.category ?? ""}
              postDate={taskDetails?.postDate}
              postMonth={taskDetails?.postMonth}
              postYear={taskDetails?.postYear}
              TaskStatus={taskDetails?.done}
              VotingType={votingDetails?.type ?? ""}
              votingTypeDetails={votingArr}
            />
          ))}
        {taskDetails.category === "Youtube_Thumbnail" &&
          categoryDetails?.Youtube_Thumbnail_Images.map((url, idx) => (
            <Task
              amount={taskDetails?.amount}
              key={idx}
              imageUrl={url ?? ""}
              description={""}
              votes={MaxVotes}
              category={taskDetails?.category ?? ""}
              postDate={taskDetails?.postDate}
              postMonth={taskDetails?.postMonth}
              postYear={taskDetails?.postYear}
              TaskStatus={taskDetails?.done}
              VotingType={votingDetails?.type ?? ""}
              votingTypeDetails={votingArr}
            />
          ))}
        {taskDetails.category === "Miscellaneous" &&
          categoryDetails?.Images.map((url, idx) => (
            <Task
              amount={taskDetails?.amount}
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Description ?? ""}
              votes={MaxVotes}
              category={taskDetails?.category ?? ""}
              postDate={taskDetails?.postDate}
              postMonth={taskDetails?.postMonth}
              postYear={taskDetails?.postYear}
              TaskStatus={taskDetails?.done}
              VotingType={votingDetails?.type ?? ""}
              votingTypeDetails={votingArr}
            />
          ))}
        {taskDetails.category === "Miscellaneous" &&
          categoryDetails?.Design_Url.map((url, idx) => (
            <Task
              amount={taskDetails?.amount}
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Description ?? ""}
              votes={MaxVotes}
              category={taskDetails?.category ?? ""}
              postDate={taskDetails?.postDate}
              postMonth={taskDetails?.postMonth}
              postYear={taskDetails?.postYear}
              TaskStatus={taskDetails?.done}
              VotingType={votingDetails?.type ?? ""}
              votingTypeDetails={votingArr}
            />
          ))}
      </div>
    </div>
  );
}

function Task({
  amount,
  imageUrl,
  description,
  votes,
  category,
  postDate,
  postMonth,
  postYear,
  TaskStatus,
  VotingType,
  votingTypeDetails,
}: {
  amount: String;
  imageUrl: string;
  description: string;
  votes: number;
  category: string;
  postDate: number;
  postMonth: number;
  postYear: number;
  TaskStatus: string;
  VotingType: string;
  votingTypeDetails: any;
}) {
  return (
    <TaskCard
      amount={amount}
      imageUrl={imageUrl}
      votes={votes}
      description={description}
      category={category}
      postDate={postDate}
      postMonth={postMonth}
      postYear={postYear}
      TaskStatus={TaskStatus}
      VotingType={VotingType}
      votingTypeDetails={votingTypeDetails}
    />
  );
}
