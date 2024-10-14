"use client";

import LoadingPage from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import { BACKEND_URL } from "@/utils";
import { Chip } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedModal from "@/components/AnimatedModal";
import { Button, useDisclosure } from "@nextui-org/react";

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
  const [customLoader, setCustomLoader] = useState(false);
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

      data.categoryDetails &&
        setMaxVotes(data.categoryDetails.Responses.length - 1);

      votingTypeDetails &&
        Object.entries(data.votingTypeDetails).forEach(
          (val: any, idx: number) => {
            setParticularVotingArr((prev) => [
              ...prev,
              {
                type: val[1],
                votes: 0,
                taskOption: 0,
              },
            ]);
          }
        );
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
  const GudelinesArr = [categoryDetails?.Description ?? "No Description"];

  return (
    <div className="bg-gray-950 text-white pt-10 px-10 pb-14 w-full flex flex-col justify-center items-center gap-10">
      {customLoader && <LoadingPage />}
      <AnimatedModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        title="Description"
        content={GudelinesArr}
      />
      <div className="capitalize font-semibold text-3xl flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-2 bg-slate-800 w-full px-10 py-4 rounded-xl">
        <div className="flex justify-center items-center gap-2">
          <Chip
            color="default"
            className="md:text-lg font-semibold bg-slate-700 text-white"
          >
            Task Date:{" "}
            {new Date(
              taskDetails?.postYear,
              taskDetails?.postMonth,
              taskDetails?.postDate
            ).toLocaleDateString()}
          </Chip>
          <Chip
            color="secondary"
            className="md:text-lg font-semibold bg-slate-700 text-white"
          >
            Amount: {parseFloat(taskDetails?.amount.toString()) / 1000_000_000}{" "}
            SOL
          </Chip>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            isIconOnly
            color="default"
            onPress={onOpen}
            className="text-xl bg-slate-700 text-white"
          >
            ?
          </Button>
          {taskDetails.category == "UI_UX_Design" &&
            categoryDetails?.Design_Title}
          {taskDetails.category == "Idea_Product" &&
            categoryDetails?.Idea_Title}
          {taskDetails.category == "Youtube_Thumbnail" &&
            categoryDetails?.Youtube_Thumbnail_Title}
          {taskDetails.category == "Miscellaneous" && categoryDetails?.title}
          <Chip color="primary" className="bg-slate-700 text-white">
            {taskDetails?.category}
          </Chip>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Chip color="success" className="text-lg bg-slate-700 text-white">
            Task Status: {taskDetails?.done === true ? "Completed" : "Open"}
          </Chip>
          <Chip color="warning" className="text-lg bg-slate-700 text-white">
            MaxVotes: {MaxVotes}
          </Chip>
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
