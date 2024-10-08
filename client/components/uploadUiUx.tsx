"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskSubmittingLoader from "./TaskSubmittingLoader";
import TransactionLoadingPage from "./TransactionLoading";
import VoteSelection from "./VoteSelection";
import { Button, useDisclosure } from "@nextui-org/react";
import AnimatedModal from "./AnimatedModal";

export const UploadUiUxPageComponent = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [urlPreview, setUrlPreview] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [TaskSubmitLoader, setTaskSubmitLoader] = useState(false);
  const [transactionLoader, setTransactionLoader] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [websiteModal, setWebsiteModal] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [tasksAmt, setTasksAmt] = useState(0);
  const [votingType, setVotingType] = useState("Rating_Scale");
  const [votingCustomOptionsArr, setvotingCustomOptionsArr] = useState<
    string[]
  >([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disableBtn, setDisableBtn] = useState(false);

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

  function openModal() {
    setWebsiteModal(true);
  }
  function closeModal() {
    setWebsiteModal(false);
  }
  function openConfimationModal() {
    if (title === "" || urlPreview.length === 0) {
      toast.error("Title and URL are required");
      return;
    }
    setModalIsOpen(true);
  }
  function closeConfirmationModal() {
    setModalIsOpen(false);
  }
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

      closeConfirmationModal();
      setTxSignature(signature);
      toast.success("Transaction successful");
    } catch (err) {
      toast.error("Transaction failed");
    }
    setTransactionLoader(false);
  }
  async function onSubmit() {
    setTaskSubmitLoader(true);
    setDisableBtn(true);

    try {
      let d = new Date();
      let currDate = d.getUTCDate();
      let currMonth = d.getUTCMonth();
      let currYear = d.getUTCFullYear();

      const response = await axios.post(
        `${BACKEND_URL}/v1/user/task`,
        {
          category: "UI_UX_Design",
          title,
          url: urlPreview,
          description: description,
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
    setDisableBtn(false);
  }
  const GudelinesArr = [
    "Please make sure only one website url should be uploaded at a time.",
    "If you have multiple websites to upload, please upload them one by one.",
    "Make sure the website is live and accessible to everyone.",
  ];

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5 w-full md:px-2">
      <AnimatedModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        title="Gudelines for Uploading UI/UX Design"
        content={GudelinesArr}
      />
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
      {transactionLoader && <TransactionLoadingPage />}
      {TaskSubmitLoader && <TaskSubmittingLoader />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeConfirmationModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">
            How much would you like to pay?
          </h1>
          <input
            type="number"
            placeholder="Enter some decimal solana amount"
            className="w-full p-2 rounded border border-gray-300 bg-gray-800"
            value={tasksAmt}
            onChange={(e) => {
              setTasksAmt(parseFloat(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                if (title === "" || urlPreview.length === 0) {
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
      <div className="flex gap-2 justify-center items-center">
        <h1 className="text-2xl w-1/2 md:w-full text-center md:text-4xl font-bold uppercase">
          Upload your Creativity
        </h1>
        <Button isIconOnly color="primary" onPress={onOpen}>
          ?
        </Button>
      </div>
      <div className="flex flex-col gap-1 justify-center items-start px-6 w-full">
        <label htmlFor="designTitle" className="text-lg text-start">
          Design Title *
        </label>
        <input
          type="text"
          id="designTitle"
          disabled={disableBtn}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-950 rounded-md w-full"
        />
      </div>
      <div className="flex flex-col gap-1 justify-start items-start px-6 w-full">
        <label htmlFor="designUrl" className="text-lg">
          Design/Website Url *
        </label>
        <input
          type="text"
          id="designUrl"
          max={1}
          value={url}
          disabled={disableBtn}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (urlPreview.length > 0) {
                toast.error(
                  "Only one website url should be uploaded at a time."
                );
              } else {
                setUrlPreview([...urlPreview, url]);
                setUrl("");
              }
            }
          }}
          className="bg-gray-950 rounded-md w-full"
        />
      </div>
      <div
        className={`flex justify-center items-center gap-2 flex-wrap ${
          urlPreview.length > 0 && "h-20"
        }`}
      >
        {urlPreview.length > 0 &&
          urlPreview.map((url, index) => (
            <div className="flex relative" key={index}>
              <button
                className="h-12 items-center justify-center rounded-md border border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:150%_100%] bg-right hover:bg-left px-6 font-medium text-white transition-all duration-1000 ease-in-out focus:outline-none pr-8"
                disabled={disableBtn}
                onClick={() => {
                  setWebsiteModal(true);
                }}
              >
                {`Preview ${index + 1}`}
              </button>
              <button
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
      <div className="flex flex-col gap-1 justify-start items-start px-6 w-full">
        <label htmlFor="designDescription" className="text-lg">
          Design Description (OPTIONAL)
        </label>
        <textarea
          id="designDescription"
          value={description}
          disabled={disableBtn}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-950 rounded-md w-full"
        />
      </div>
      <div className="flex flex-col gap-2 justify-start items-start px-6 md:w-full">
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
      <button
        onClick={txSignature ? onSubmit : openConfimationModal}
        type="button"
        disabled={disableBtn}
        className="relative rounded px-5 py-2.5 overflow-hidden group bg-blue-700 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all ease-out duration-300 text-2xl font-semibold z"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="relative">{txSignature ? "Submit Task" : "Pay"}</span>
      </button>
    </div>
  );
};
