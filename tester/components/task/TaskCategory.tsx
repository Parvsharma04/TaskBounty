import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import Modal from "react-modal";
import TaskImage from "../TaskImage";

interface Option {
  votingTypeDetails: Record<string, any>;
  id: number;
  image_url: string[];
}

interface TaskOptionsProps {
  option: Option;
  taskOptionSelect: number;
  setTaskOptionSelect: (value: number) => void;
  category: string;
}

const TaskOptions: React.FC<TaskOptionsProps> = ({
  option,
  taskOptionSelect,
  setTaskOptionSelect,
  category,
}) => {
  const [websiteModal, setWebsiteModal] = useState(false);
  const [url, setUrl] = useState("");
  const [isImage, setIsImage] = useState(true);

  const handleOptionSelect = (idx: number) => {
    setTaskOptionSelect(idx);
  };

  const openModal = (contentUrl: string, isImageContent: boolean) => {
    setUrl(contentUrl);
    setIsImage(isImageContent);
    setWebsiteModal(true);
  };

  const closeModal = () => {
    setWebsiteModal(false);
  };

  const UrlCustomStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: 0,
      maxWidth: "90vw",
      maxHeight: "90vh",
    },
  };

  return (
    <>
      <Modal
        isOpen={websiteModal}
        onRequestClose={closeModal}
        style={UrlCustomStyles}
        contentLabel={isImage ? "Image Preview" : "Website Preview"}
      >
        <div className="flex flex-col gap-3">
          {/* Close Button */}
          <div className="flex justify-end p-2">
            <button
              onClick={closeModal}
              className="text-xl font-bold bg-red-700 w-8 h-8 rounded flex justify-center items-center"
            >
              X
            </button>
          </div>
          {isImage ? (
            <img
              src={url}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <iframe
              src={url}
              className="w-[60vw] h-[60vh]"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </Modal>
      <div className="flex gap-4">
        {category == "UI_UX_Design" && (
          <div
            className="relative cursor-pointer bg-gray-800 rounded-md p-4 transition-transform duration-300 hover:scale-105"
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="text-white font-medium">
              <span>Visit: </span>
              <a
                href={option.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400"
              >
                {option.image_url}
              </a>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(option.image_url[0]!, false);
              }}
              className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
            >
              <FaEye size={18} />
            </button>
          </div>
        )}
        {category != "UI_UX_Design" &&
          option.image_url &&
          option.image_url.map((imageUrl: string, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer bg-gray-900 rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 p-2"
              onClick={() => handleOptionSelect(idx)}
            >
              <TaskImage imageUrl={imageUrl} />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={taskOptionSelect === idx}
                  readOnly
                  className={`w-5 h-5 rounded-full ${
                    taskOptionSelect === idx
                      ? "bg-green-500 border-green-600"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(imageUrl, true);
                }}
                className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
              >
                <FaEye size={18} />
              </button>
            </div>
          ))}
      </div>
      {option.votingTypeDetails && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(option.votingTypeDetails).map(([key, value], idx) => (
            <div
              key={idx}
              className="cursor-pointer bg-gray-800 p-3 rounded-md text-center hover:bg-gray-700 transition-colors"
              onClick={() => handleOptionSelect(idx)}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

interface TaskTitleProps {
  title: string;
}

const TaskTitle: React.FC<TaskTitleProps> = ({ title }) => {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-center my-4">{title}</h2>
  );
};

interface TaskCategoryProps {
  category: string;
  title: string;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ category, title }) => {
  return (
    <div className="text-center mb-6">
      <span className="text-base sm:text-lg bg-blue-500 px-3 py-1 sm:px-4 sm:py-2 rounded-md inline-block">
        Bounty: {category}
      </span>
      <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-semibold">
        {title}
      </h2>
    </div>
  );
};

export { TaskCategory, TaskOptions, TaskTitle };
