"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import TaskSubmittingLoader from "./TaskSubmittingLoader";
import TransactionLoadingPage from "./TransactionLoading";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { UploadImage } from "./UploadImage";
import Image from "next/image";
import VoteSelection from "./VoteSelection";

const MiscellaneousComponent = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageModalIsOpen, setimageModalIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [TaskSubmitLoader, setTaskSubmitLoader] = useState(false);
  const [transactionLoader, setTransactionLoader] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [tasksAmt, setTasksAmt] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [url, setUrl] = useState("");
  const [modalUrl, setModalUrl] = useState("");
  const [urlPreview, setUrlPreview] = useState<string[]>([]);
  const [websiteModal, setWebsiteModal] = useState(false);
  const [votingType, setVotingType] = useState("Rating_Scale");

  function openImageModal() {
    setimageModalIsOpen(true);
  }
  function closeImageModal() {
    setimageModalIsOpen(false);
  }
  function openConfimationModal() {
    setModalIsOpen(true);
  }
  function closeConfirmationModal() {
    setModalIsOpen(false);
  }
  function openWebsiteModal() {
    setWebsiteModal(true);
  }
  function closeWebsiteModal() {
    setWebsiteModal(false);
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
  const WebsiteCustomStyles = {
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
  async function makePayment() {
    setTransactionLoader(true);
    closeConfirmationModal();
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
    } catch (err) {
      toast.error("Transaction failed");
    }
    setTransactionLoader(false);
    toast.success("Transaction successful");
  }
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
          category: "Miscellaneous",
          title,
          images,
          description,
          url: urlPreview,
          votingType,
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

      console.log(response);

      router.push(`/task/${response.data.id}`);
    } catch (err) {
      toast.error("Task submission failed");
    }
    setTaskSubmitLoader(false);
  }

  return (
    <div
      className={`h-screen mb-20 md:mb-36 ${
        urlPreview && images.length > 0 && "mb-64"
      }`}
    >
      {transactionLoader && <TransactionLoadingPage />}
      {TaskSubmitLoader && <TaskSubmittingLoader />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeConfirmationModal}
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
      <Modal
        isOpen={websiteModal}
        onRequestClose={closeWebsiteModal}
        style={WebsiteCustomStyles}
        contentLabel="Image Courasel"
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button
              onClick={closeWebsiteModal}
              className="text-2xl font-bold bg-red-700 w-10 h-10 rounded flex justify-center items-center"
            >
              X
            </button>
          </div>
          <iframe
            src={modalUrl}
            className="w-[60vw] h-[60vh]"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
      <div className="flex flex-col gap-10 items-center mt-16 justify-center">
        <h1 className="text-3xl md:text-5xl px-6 text-center font-bold uppercase">
          Miscellaneous Upload
        </h1>
        <div className="flex flex-col w-full md:px-12 gap-5">
          <div className="flex flex-col gap-2 justify-center items-start px-6 md:w-full">
            <label htmlFor="designTitle" className="text-base text-start">
              Title
            </label>
            <input
              type="text"
              id="designTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-950 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2 px-6 md:w-full">
            <label className="block font-medium text-base">Images</label>
            <UploadImage
              onImageAdded={(imageUrl) => {
                setImages((i) => [...i, imageUrl]);
              }}
            />
            {images.length > 0 && (
              <button
                onClick={() => setimageModalIsOpen(true)}
                className="inline-flex mt-4 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none w-full"
              >
                Preview Images
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2 justify-start items-start px-6 md:w-full">
            <label htmlFor="designDescription" className="text-base">
              Description
            </label>
            <textarea
              rows={2}
              id="designDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-950 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col gap-2 justify-start items-start px-6 md:w-full">
            <label htmlFor="designUrl" className="text-lg">
              Design/Website Url
            </label>
            <input
              type="text"
              id="designUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUrlPreview([...urlPreview, url]);
                  setUrl("");
                }
              }}
              className="bg-gray-950 rounded-md w-full"
            />
          </div>
          {urlPreview.length > 0 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {urlPreview.map((url, index) => (
                <div className="flex relative" key={index}>
                  <button
                    key={index}
                    className="relative h-12 items-center justify-center rounded-md border border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:150%_100%] bg-right hover:bg-left px-6 font-medium text-white transition-all duration-1000 ease-in-out focus:outline-none pr-8"
                    onClick={() => {
                      setWebsiteModal(true);
                      setModalUrl(url);
                    }}
                  >
                    {`Preview ${index + 1}`}
                  </button>
                  <button
                    key={index}
                    className="bg-red-700 hover:bg-red-500 p-1 rounded flex justify-start items-center h-5 absolute right-0"
                    onClick={() => {
                      setUrlPreview(urlPreview.filter((_, i) => i !== index));
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 justify-start items-start px-6 md:w-full">
            <label htmlFor="designDescription" className="text-base">
              Choose the type of voting
            </label>
            <VoteSelection setVotingType={setVotingType} />
          </div>
        </div>
        <button
          onClick={txSignature ? onSubmit : openConfimationModal}
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
  );
};

export default MiscellaneousComponent;
