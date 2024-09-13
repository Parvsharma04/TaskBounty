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
  const [tasksAmt, setTasksAmt] = useState(0);

  useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected, router]);

  async function onSubmit() {
    let d = new Date();
    let currDate = d.getUTCDate();
    let currMonth = d.getUTCMonth();
    let currYear = d.getUTCFullYear();

    const response = await axios.post(
      `${BACKEND_URL}/v1/user/task`,
      {
        options: images.map((image) => ({
          imageUrl: image,
        })),
        title,
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
  }

  async function makePayment() {
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
    closeModal();
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
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="flex justify-center pt-10">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex flex-col gap-3 mt-5">
          <h1 className="text-lg font-semibold">
            How much would you like to pay?
          </h1>
          <input
            type="number"
            placeholder="Enter some decimal solana amount"
            className="w-full p-2 rounded border border-gray-300"
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
      <div className="max-w-screen-lg w-full">
        <div className="flex justify-center items-center mt-16 mb-10 text-3xl w-full">
          Create a task
        </div>
        <div className="flex flex-col justify-center items-start gap-3">
          <label className=" block text-md font-medium text-gray-900">
            Task details
          </label>

          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="What is your task?"
            required
          />
        </div>

        <div className="flex flex-col justify-center items-start gap-3">
          <label className=" block mt-8 mb-2 text-md font-medium text-gray-900">
            Add Images
          </label>

          {images.length > 0 && (
            <div
              id="default-carousel"
              className="relative w-full border-2 border-gray-200 rounded-lg dark:border-gray-700"
              data-carousel="slide"
            >
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
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
                      className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                      width={100}
                      height={100}
                      alt={`Slide ${idx}`}
                    />
                  </div>
                ))}
              </div>

              {/* Indicators */}
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

              {/* Previous Button */}
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

              {/* Next Button */}
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
          )}
          <UploadImage
            onImageAdded={(imageUrl) => {
              setImages((i) => [...i, imageUrl]);
            }}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            // onClick={txSignature ? onSubmit :  makePayment}
            onClick={txSignature ? onSubmit : openModal}
            type="button"
            className="mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {txSignature ? "Submit Task" : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};
