"use client";

import Image from "next/image";
import "../styles/taskCard.css";
import { useEffect, useState } from "react";
import VotingTypeTable from "./VotingTypeTable";
import { Chip } from "@nextui-org/react";
import Modal from "react-modal";

interface TaskCardProps {
  imageUrl: string;
  description: string;
  votes: number;
  category: string;
  amount: String;
  postDate?: number;
  postMonth?: number;
  postYear?: number;
  TaskStatus?: boolean;
  VotingType?: string;
  votingTypeDetails?: any;
  type: string;
}

const TaskCard = ({
  amount,
  imageUrl,
  type,
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
  const [websiteModal, setWebsiteModal] = useState(false);
  const [url, setUrl] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageModalIsOpen, setimageModalIsOpen] = useState(false);
  const [votesLeft, setVotesLeft] = useState(0);

  useEffect(() => {
    if (postYear && postMonth && postDate) {
      setCurrentDate(new Date(postYear, postMonth, postDate));
    }
    if (amount) {
      setcurrAmt(parseFloat(amount.toString()) / 1000_000_000);
      setVotesLeft(
        parseFloat(amount.toString()) / 1000_000_000 / 0.0002 - votes
      );
    }
  }, [postYear, postMonth, postDate, amount]);

  function openModal() {
    setWebsiteModal(true);
  }
  function closeModal() {
    setWebsiteModal(false);
  }
  const UrlCustomStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
  };
  // const handlePrev = () => {
  //   setActiveIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };
  // const handleNext = () => {
  //   setActiveIndex((prevIndex) =>
  //     prevIndex === images.length - 1 ? 0 : prevIndex + 1
  //   );
  // };
  const imageCustomStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
  };
  function openImageModal() {
    setimageModalIsOpen(true);
  }
  function closeImageModal() {
    setimageModalIsOpen(false);
  }

  return (
    <div className="flip-card">
      <Modal
        isOpen={websiteModal}
        onRequestClose={closeModal}
        style={UrlCustomStyles}
        contentLabel="Image Courasel"
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="text-2xl font-bold bg-red-700 w-10 h-10 rounded flex justify-center items-center"
            >
              X
            </button>
          </div>
          <iframe
            src={url}
            className="w-[60vw] h-[60vh]"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
      <Modal
        isOpen={imageModalIsOpen}
        onRequestClose={closeImageModal}
        style={imageCustomStyles}
        contentLabel="Image Courasel"
      >
        <div className="flex flex-col gap-3">
          <div
            id="default-carousel"
            className="relative w-full border-2 rounded-lg"
            data-carousel="slide"
          >
            <div className="relative flex justify-center items-center h-full rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                width={500}
                height={500}
                alt={`Card Image`}
              />
            </div>

            {/* <div className="absolute flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-3 h-3 rounded-full ${
                    idx === activeIndex ? "bg-blue-500" : "bg-gray-500"
                  }`}
                  aria-current={idx === activeIndex ? "true" : "false"}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                ></button>
              ))}
            </div> */}

            {/* <button
              type="button"
              className="absolute top-0 left-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={handlePrev}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-white/30 bg-gray-800/30 dark:group-hover:bg-white/50 group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>

            <button
              type="button"
              className="absolute top-0 right-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={handleNext}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-white/30 bg-gray-800/30 dark:group-hover:bg-white/50 group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 9l4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button> */}
          </div>
        </div>
      </Modal>
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
                Votes Left: <Chip color="default">{votesLeft}</Chip>
              </h1>
              <h1 className="text-xl text-black font-semibold flex justify-center items-center gap-2">
                Task Status:{" "}
                <Chip color="success" className="text-white">
                  {TaskStatus === true ? "Completed" : "Open"}
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
          <div className="flex justify-center items-center gap-3">
            <p className="font-bold text-xl pb-4 text-white flex justify-center items-center">
              Voting Type: {VotingType}
            </p>
            <button
              onClick={() => {
                if (category == "UI_UX_Design") {
                  setUrl(imageUrl);
                  openModal();
                } else if (category == "Idea_Product") {
                  openImageModal();
                } else if (category == "Youtube_Thumbnail") {
                  openImageModal();
                } else if (category == "Miscellaneous") {
                  if (type == "image") {
                    openImageModal();
                  } else {
                    setUrl(imageUrl);
                    openModal();
                  }
                }
              }}
              className="flex justify-center items-center pb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="px-2 overflow-scroll h-72">
            <VotingTypeTable votingTypeDetails={votingTypeDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
