"use client";

import { UploadImage } from "@/components/UploadImage";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/styles/UploadPage.css";
import TransactionLoadingPage from "./TransactionLoading";
import { toast } from "react-toastify";
import TaskSubmittingLoader from "./TaskSubmittingLoader";
import VoteSelection from "./VoteSelection";
import { Button, useDisclosure } from "@nextui-org/react";
import AnimatedModal from "./AnimatedModal";

export const Upload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const wallet = useWallet();
  const { signMessage } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [imageModalIsOpen, setimageModalIsOpen] = useState(false);
  const [tasksAmt, setTasksAmt] = useState(0);
  const [transactionLoader, setTransactionLoader] = useState(false);
  const [TaskSubmitLoader, setTaskSubmitLoader] = useState(false);
  const [votingType, setVotingType] = useState("Rating_Scale");
  const [votingCustomOptionsArr, setvotingCustomOptionsArr] = useState<
    string[]
  >([]);

  // Voting stars
  const [fiveStar, setFiveStar] = useState("");
  const [fourStar, setFourStar] = useState("");
  const [threeStar, setThreeStar] = useState("");
  const [twoStar, setTwoStar] = useState("");
  const [oneStar, setOneStar] = useState("");

  // Multiple choice poll
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  // Up and down vote
  const [upVote, setUpVote] = useState("");
  const [downVote, setDownVote] = useState("");

  // Emoji votes
  const [emoji1, setEmoji1] = useState("");
  const [emoji2, setEmoji2] = useState("");
  const [emoji3, setEmoji3] = useState("");
  const [emoji4, setEmoji4] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected, router]);

  async function onSubmit() {
    setTaskSubmitLoader(true);

    try {
      let d = new Date();
      let currDate = d.getUTCDate();
      let currMonth = d.getUTCMonth();
      let currYear = d.getUTCFullYear();

      const response = await axios.post(
        `${BACKEND_URL}/v1/user/task`,
        {
          category: "Youtube_Thumbnail",
          title,
          images,
          votingType: votingType,
          votingCustomOptionsArr: votingCustomOptionsArr,
          signature: txSignature,
          postDate: currDate,
          postMonth: currMonth,
          postYear: currYear,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      router.push(`/task/${response.data.id}`);
    } catch (err) {
      toast.error("Task submission failed");
    }
    setTaskSubmitLoader(false);
  }

  async function makePayment() {
    setTransactionLoader(true);
    closeModal();
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey!,
          toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
          lamports: 1000000000 * tasksAmt,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await wallet.sendTransaction(transaction, connection, {
        minContextSlot,
      });

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      setTxSignature(signature);
      toast.success("Transaction successful");
    } catch (err) {
      toast.error("Transaction failed");
    }
    setTransactionLoader(false);
  }

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1F2937",
      color: "white",
    },
  };
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
  function openModal() {
    if (title === "" || images.length === 0) {
      toast.error("Title and Images are required");
      return;
    }
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openImageModal() {
    setimageModalIsOpen(true);
  }
  function closeImageModal() {
    setimageModalIsOpen(false);
  }
  const GudelinesArr = [
    "1. Title and Images are required",
    "2. Pay the required amount to post the task",
    "3. Once the task is posted, it cannot be edited",
    "4. Task will be live after the transaction is confirmed",
  ];

  return (
    <div
      className={`${
        images.length > 0 ? "h-[47rem]" : "h-screen"
      } flex flex-col justify-center items-center gap-5 w-full px-6 md:px-8`}
    >
      {transactionLoader && <TransactionLoadingPage height="h-[47rem]" />}
      {TaskSubmitLoader && <TaskSubmittingLoader height="h-[47rem]" />}
      <AnimatedModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        title="Guidelines for Youtube Thumbnail Upload"
        content={GudelinesArr}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-base font-semibold">
            How much would you like to pay?
          </h1>
          <input
            type="number"
            placeholder="Enter some decimal solana amount"
            className="w-full p-2 rounded border border-gray-300 bg-gray-800"
            value={tasksAmt}
            onChange={(e) => setTasksAmt(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                if (title === "" || images.length === 0) {
                  toast.error("Title and URL are required");
                  return;
                } else if (tasksAmt <= 0) {
                  toast.error("Amount should be greater than 0");
                  return;
                } else if (tasksAmt === 0) {
                  toast.error("Amount is required");
                  return;
                }
                makePayment();
              }
            }}
          />
          <button
            className="capitalize p-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            onClick={makePayment}
          >
            Confirm
          </button>
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
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className={`duration-700 ease-in-out ${
                    idx === activeIndex ? "block" : "hidden"
                  }`}
                  data-carousel-item
                >
                  <Image
                    src={image}
                    width={500}
                    height={500}
                    alt={`Slide ${idx}`}
                  />
                </div>
              ))}
            </div>

            <div className="absolute flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
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
            </div>

            <button
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
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col w-full gap-5">
        <div className="flex gap-2 justify-center items-center">
          <h1 className="text-2xl text-center md:text-4xl font-bold uppercase">
            POST NEW BOUNTY
          </h1>
          <Button isIconOnly color="primary" onPress={onOpen}>
            ?
          </Button>
        </div>
        <div className="flex flex-col justify-center items-start gap-3">
          <label className="block font-medium text-base">Task details *</label>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            id="first_name"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-950 rounded"
            placeholder="What is your task?"
            required
          />
        </div>

        <div className="flex flex-col justify-center items-start gap-3">
          <label className="block font-medium text-base">Add Images *</label>
          <UploadImage
            onImageAdded={(imageUrl) => {
              setImages((i) => [...i, imageUrl]);
            }}
          />
          {images.length > 0 && (
            <button
              onClick={() => setimageModalIsOpen(true)}
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none w-full mt-4"
            >
              Show Images
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-start items-start md:w-full">
          <label htmlFor="designDescription" className="text-base">
            Choose the type of voting *
          </label>
          <VoteSelection
            fiveStar={fiveStar}
            setFiveStar={setFiveStar}
            fourStar={fourStar}
            setFourStar={setFourStar}
            threeStar={threeStar}
            setThreeStar={setThreeStar}
            twoStar={twoStar}
            setTwoStar={setTwoStar}
            oneStar={oneStar}
            setOneStar={setOneStar}
            setVotingType={setVotingType}
            option1={option1}
            setOption1={setOption1}
            option2={option2}
            setOption2={setOption2}
            option3={option3}
            setOption3={setOption3}
            option4={option4}
            setOption4={setOption4}
            upVote={upVote}
            setUpVote={setUpVote}
            downVote={downVote}
            setDownVote={setDownVote}
            emoji1={emoji1}
            setEmoji1={setEmoji1}
            emoji2={emoji2}
            setEmoji2={setEmoji2}
            emoji3={emoji3}
            setEmoji3={setEmoji3}
            emoji4={emoji4}
            setEmoji4={setEmoji4}
            setvotingCustomOptionsArr={setvotingCustomOptionsArr}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={txSignature ? onSubmit : openModal}
            type="button"
            disabled={TaskSubmitLoader || transactionLoader}
            className="relative rounded px-5 py-2.5 overflow-hidden group bg-blue-700 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all ease-out duration-300 text-2xl font-semibold"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">
              {txSignature ? "Submit Task" : "Pay"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
