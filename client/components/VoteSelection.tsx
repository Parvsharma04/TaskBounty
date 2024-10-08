"use client";

import { DoubleArrowIcon } from "@/utils/DoubleArrowIcon";
import { EmojiIcon } from "@/utils/EmojiIcon";
import { PencilIcon } from "@/utils/PencilIcon";
import { PollIcon } from "@/utils/PollIcon";
import { StarIcon } from "@/utils/StarIcon";
import { Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import Modal from "react-modal";

interface voteSelectionProps {
  fiveStar: string;
  fourStar: string;
  threeStar: string;
  twoStar: string;
  oneStar: string;
  setFiveStar: (fiveStar: string) => void;
  setFourStar: (fourStar: string) => void;
  setThreeStar: (threeStar: string) => void;
  setTwoStar: (twoStar: string) => void;
  setOneStar: (oneStar: string) => void;
  setVotingType: (votingType: string) => void;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  setOption1: (option1: string) => void;
  setOption2: (option2: string) => void;
  setOption3: (option3: string) => void;
  setOption4: (option4: string) => void;
  upVote: string;
  downVote: string;
  setUpVote: (upVote: string) => void;
  setDownVote: (downVote: string) => void;
  emoji1: string;
  emoji2: string;
  emoji3: string;
  emoji4: string;
  setEmoji1: (emoji1: string) => void;
  setEmoji2: (emoji2: string) => void;
  setEmoji3: (emoji3: string) => void;
  setEmoji4: (emoji4: string) => void;
  setvotingCustomOptionsArr: (votingCustomOptionsArr: string[]) => void;
}

export default function VoteSelection({
  fiveStar,
  fourStar,
  threeStar,
  twoStar,
  oneStar,
  setFiveStar,
  setFourStar,
  setThreeStar,
  setTwoStar,
  setOneStar,
  setVotingType,
  option1,
  option2,
  option3,
  option4,
  setOption1,
  setOption2,
  setOption3,
  setOption4,
  upVote,
  downVote,
  setUpVote,
  setDownVote,
  emoji1,
  emoji2,
  emoji3,
  emoji4,
  setEmoji1,
  setEmoji2,
  setEmoji3,
  setEmoji4,
  setvotingCustomOptionsArr,
}: voteSelectionProps) {
  const [rateModalIsOpen, setRateModalIsOpen] = useState(false);
  const [pollModalIsOpen, setPollModalIsOpen] = useState(false);
  const [upDownVoteModalIsOpen, setUpDownVoteModalIsOpen] = useState(false);
  const [emojiModalIsOpen, setEmojiModalIsOpen] = useState(false);

  function openRateConfimationModal() {
    setRateModalIsOpen(true);
  }
  function closeRateConfirmationModal() {
    setRateModalIsOpen(false);
  }
  function openPollConfimationModal() {
    setPollModalIsOpen(true);
  }
  function closePollConfirmationModal() {
    setPollModalIsOpen(false);
  }
  function openUpDownVoteConfimationModal() {
    setUpDownVoteModalIsOpen(true);
  }
  function closeUpDownVoteConfirmationModal() {
    setUpDownVoteModalIsOpen(false);
  }
  function openEmojiConfimationModal() {
    setEmojiModalIsOpen(true);
  }
  function closeEmojiConfirmationModal() {
    setEmojiModalIsOpen(false);
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

  return (
    <div className="flex w-full flex-col">
      <Modal
        isOpen={rateModalIsOpen}
        onRequestClose={closeRateConfirmationModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-semibold text-center uppercase">
            Customize your rating scale
          </h1>
          <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fiveStart">5 Star</label>
              <input
                placeholder="Customize your 5th star"
                type="text"
                value={fiveStar}
                onChange={(e) => setFiveStar(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fourStart">4 Star</label>
              <input
                placeholder="Customize your 4th star"
                type="text"
                value={fourStar}
                onChange={(e) => setFourStar(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="threeStart">3 Star</label>
              <input
                placeholder="Customize your 3rd star"
                type="text"
                value={threeStar}
                onChange={(e) => setThreeStar(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="twoStart">2 Star</label>
              <input
                placeholder="Customize your 2nd star"
                type="text"
                value={twoStar}
                onChange={(e) => setTwoStar(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="oneStart">1 Star</label>
              <input
                placeholder="Customize your 1st star"
                type="text"
                value={oneStar}
                onChange={(e) => setOneStar(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            className="capitalize p-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              setvotingCustomOptionsArr([
                fiveStar,
                fourStar,
                threeStar,
                twoStar,
                oneStar,
              ]);
              closeRateConfirmationModal();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={pollModalIsOpen}
        onRequestClose={closePollConfirmationModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-semibold text-center uppercase">
            Customize your Poll scale
          </h1>
          <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fiveStart">Option 1</label>
              <input
                placeholder="Customize your 1st option"
                type="text"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fourStart">Option 2</label>
              <input
                placeholder="Customize your 2nd option"
                type="text"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="threeStart">Option 3</label>
              <input
                placeholder="Customize your 3rd option"
                type="text"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="twoStart">Option 4</label>
              <input
                placeholder="Customize your 4th option"
                type="text"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            className="capitalize p-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              setvotingCustomOptionsArr([option1, option2, option3, option4]);
              closePollConfirmationModal();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={upDownVoteModalIsOpen}
        onRequestClose={closeUpDownVoteConfirmationModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-semibold text-center uppercase">
            Customize your up/down vote scale
          </h1>
          <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fiveStart">Upvote</label>
              <input
                placeholder="Customize your upvote option"
                type="text"
                value={upVote}
                onChange={(e) => setUpVote(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fourStart">Downvote</label>
              <input
                placeholder="Customize your downvote option"
                type="text"
                value={downVote}
                onChange={(e) => setDownVote(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            className="capitalize p-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              setvotingCustomOptionsArr([upVote, downVote]);
              closeUpDownVoteConfirmationModal();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={emojiModalIsOpen}
        onRequestClose={closeEmojiConfirmationModal}
        style={customStyles}
        contentLabel="Amount Modal"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-semibold text-center uppercase">
            Customize your Emoji scale
          </h1>
          <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fiveStart">Emoji 1</label>
              <input
                placeholder="Customize your 1st emoji"
                type="text"
                value={emoji1}
                onChange={(e) => setEmoji1(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="fourStart">Emoji 2</label>
              <input
                placeholder="Customize your 2nd emoji"
                type="text"
                value={emoji2}
                onChange={(e) => setEmoji2(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="threeStart">Emoji 3</label>
              <input
                placeholder="Customize your 3rd emoji"
                type="text"
                value={emoji3}
                onChange={(e) => setEmoji3(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <label htmlFor="twoStart">Emoji 4</label>
              <input
                placeholder="Customize your 4th emoji"
                type="text"
                value={emoji4}
                onChange={(e) => setEmoji4(e.target.value)}
                className="bg-gray-600 rounded-lg p-1 px-2 placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            className="capitalize p-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              setvotingCustomOptionsArr([emoji1, emoji2, emoji3, emoji4]);
              closeEmojiConfirmationModal();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        className="md:block flex flex-wrap"
        classNames={{
          tabList: "flex-wrap md:flex-nowrap",
        }}
        onSelectionChange={(e) => setVotingType(e.toString())}
      >
        <Tab
          key="Rating_Scale"
          title={
            <div className="flex items-center justify-between space-x-2 w-full relative">
              <div className="flex items-center">
                <StarIcon />
                <span>Rating Scale</span>
              </div>
              <div className="flex" onClick={() => openRateConfimationModal()}>
                <PencilIcon />
              </div>
            </div>
          }
        />
        <Tab
          key="Poll"
          title={
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <PollIcon />
                <span>Multiple-Choice Poll</span>
              </div>
              <div className="flex" onClick={() => openPollConfimationModal()}>
                <PencilIcon />
              </div>
            </div>
          }
        />
        <Tab
          key="Upvote_Downvote"
          title={
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <DoubleArrowIcon />
                <span>Upvote/Downvote System</span>
              </div>
              <div
                className="flex"
                onClick={() => openUpDownVoteConfimationModal()}
              >
                <PencilIcon />
              </div>
            </div>
          }
        />
        <Tab
          key="Emoji_Reaction"
          title={
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <EmojiIcon />
                <span>Emoji Reaction Voting</span>
              </div>
              <div className="flex" onClick={() => openEmojiConfimationModal()}>
                <PencilIcon />
              </div>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
