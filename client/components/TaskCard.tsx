import { Chip } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../styles/taskCard.css";
import AnimatedModalTasks from "./AnimatedModalTasks"; // Import your modal component
import VotingTypeTable from "./VotingTypeTable";

interface TaskCardProps {
  imageUrl: string;
  votes: number;
  category: string;
  amount: String;
  VotingType?: string;
  votingTypeDetails?: any;
  type: string;
  responses?: any;
  idx?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  amount,
  imageUrl,
  type,
  votes,
  category,
  VotingType,
  votingTypeDetails,
  responses,
  idx = 0,
}: TaskCardProps) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [votesLeft, setVotesLeft] = useState(0);
  const [votingArr, setVotingArr] = useState<{ type: string; votes: number }[]>([]);

  useEffect(() => {
    setVotesLeft(parseFloat(amount.toString()) / 1000_000_000 / 0.0002 - votes);
    votingTypeDetails?.map((obj: any) => {
      setVotingArr((prev) => [...prev, { type: obj.type, votes: 0 }]);
    });

    responses?.slice(1).map((obj: any) => {
      if (idx + 1 === obj.taskOption) {
        setVotingArr((prev) => {
          const newArr = [...prev];
          newArr[obj.value - 1].votes += 1;
          return newArr;
        });
      }
    });
  }, [amount, votes]);

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front p-6">
          <div className="flex flex-col justify-evenly items-center rounded-xl">
            <div className="flex flex-col justify-start items-center gap-4">
              {type === "image" ? (
                <img src={imageUrl} alt="Avatar" className="w-60 h-60 rounded-md" />
              ) : (
                <iframe src={imageUrl} className="w-60 h-60 rounded-md" frameBorder="0" allowFullScreen></iframe>
              )}
              <span className="text-xl text-white font-semibold flex justify-center items-center gap-2">
                Votes Left:{" "}
                <Chip className="text-lg" color="default">
                  {votesLeft}
                </Chip>
              </span>
            </div>
          </div>
        </div>
        <div className="flip-card-back">
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => setImageModalIsOpen(true)} // Open the image modal
              className="flex justify-center items-center pb-4"
            >
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
          <div className="px-2 overflow-scroll h-72">
            <VotingTypeTable votingTypeDetails={votingArr} />
          </div>
        </div>
      </div>

      {/* Use AnimatedModalTasks for the image modal */}
      <AnimatedModalTasks
        isOpen={imageModalIsOpen}
        onOpenChange={setImageModalIsOpen}
        title="Image Preview"
      >
        <div className="flex flex-col gap-3">
          <div id="default-carousel" className="relative w-full border-2 rounded-lg" data-carousel="slide">
            <div className="relative flex justify-center items-center h-full rounded-lg overflow-hidden">
              <Image src={imageUrl} width={500} height={500} alt={`Card Image`} />
            </div>
          </div>
        </div>
      </AnimatedModalTasks>
    </div>
  );
};

export default TaskCard;
