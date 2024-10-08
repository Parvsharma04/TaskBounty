"use client";

import Image from "next/image";
import "../styles/taskCard.css";
import { useEffect, useState } from "react";
import VotingTypeTable from "./VotingTypeTable";
import { Chip } from "@nextui-org/react";

interface TaskCardProps {
  imageUrl: string;
  description: string;
  votes: number;
  category: string;
  amount: String;
  postDate?: number;
  postMonth?: number;
  postYear?: number;
  TaskStatus?: string;
  VotingType?: string;
  votingTypeDetails?: any;
}

const TaskCard = ({
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
}: TaskCardProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currAmt, setcurrAmt] = useState(0.0);

  useEffect(() => {
    if (postYear && postMonth && postDate) {
      setCurrentDate(new Date(postYear, postMonth, postDate));
    }
    if (amount) {
      setcurrAmt(parseFloat(amount.toString()) / 1000_000_000);
    }
  }, [postYear, postMonth, postDate, amount]);

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front px-2">
          <div className="flex justify-between items-center flex-col md:flex-row flex-wrap h-1/6 w-full mt-2 md:mt-0">
            <Chip color="secondary" className="md:text-lg font-semibold">
              Amount: {currAmt} SOL
            </Chip>
            <Chip color="danger" className="md:text-lg font-semibold">
              Task Date: {currentDate.toLocaleDateString()}
            </Chip>
          </div>
          <div className="flex flex-col justify-evenly items-center h-5/6">
            <div className="flex flex-col justify-start items-center gap-5">
              <h1 className="text-xl text-black font-semibold text-start w-full">
                Description: {description ? description : "No Description"}
              </h1>
              <h1 className="text-xl text-black font-semibold flex justify-center items-center gap-2">
                Task Status:{" "}
                <Chip color="success" className="text-white">
                  {TaskStatus === "true" ? "Completed" : "Open"}
                </Chip>
              </h1>
            </div>
            <p className="title mt-3 text-black">
              <span>MaxVotes: </span>
              {votes}
            </p>
          </div>
        </div>
        <div className="flip-card-back">
          <p className="font-bold text-xl pb-4 text-white">
            Voting Type: {VotingType}
          </p>
          <div className="px-2 overflow-scroll h-72">
            <VotingTypeTable votingTypeDetails={votingTypeDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
