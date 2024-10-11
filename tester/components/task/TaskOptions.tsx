import Image from "next/image";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import Modal from "react-modal";

interface Option {
  id: number;
  url?: string; // For UI/UX Design tasks
  image_url?: string; // For other task types
  votingTypeDetails?: Record<string, any>;
}

interface TaskOptionsProps {
  options: Option[];
  taskOptionSelect: number;
  setTaskOptionSelect: (value: number) => void;
  category: string;
}

const TaskOptions: React.FC<TaskOptionsProps> = ({
  options,
  taskOptionSelect,
  setTaskOptionSelect,
  category,
}) => {
  const [websiteModal, setWebsiteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleOptionSelect = (id: number) => {
    setTaskOptionSelect(id);
  };

  const openModal = (url: string) => {
    setPreviewUrl(url);
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
      width: "90vw",
      height: "90vh",
      maxWidth: "1200px",
      maxHeight: "800px",
    },
  };

  const renderOption = (option: Option, index: number) => {
    // Check if the category is "UI_UX_Design" and handle URL previews
    if (category === "UI_UX_Design" && option.url) {
      return (
        <div
          key={option.id}
          className="relative cursor-pointer bg-gray-900 rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 p-2"
          onClick={() => handleOptionSelect(option.id)}
        >
          <div className="w-full h-40 relative">
            <iframe
              src={option.url}
              className="w-full h-full border-0"
              title={`Website Preview ${index + 1}`}
            />
            <div className="absolute inset-0 bg-transparent" />
          </div>
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={taskOptionSelect === option.id}
              readOnly
              className={`w-5 h-5 rounded-full ${
                taskOptionSelect === option.id ? "bg-green-500 border-green-600" : "border-gray-300"
              }`}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(option.url!);
            }}
            className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
          >
            <FaEye size={18} />
          </button>
        </div>
      );
    } else if (option.image_url) { // For other task types
      return (
        <div
          key={option.id}
          className="relative cursor-pointer bg-gray-900 rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 p-2"
          onClick={() => handleOptionSelect(option.id)}
        >
          <Image
            src={option.image_url}
            alt={`Option ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={taskOptionSelect === option.id}
              readOnly
              className={`w-5 h-5 rounded-full ${
                taskOptionSelect === option.id ? "bg-green-500 border-green-600" : "border-gray-300"
              }`}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(option.image_url!);
            }}
            className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
          >
            <FaEye size={18} />
          </button>
        </div>
      );
    }
    return null; // In case there's no valid option
  };

  return (
    <>
      <Modal
        isOpen={websiteModal}
        onRequestClose={closeModal}
        style={UrlCustomStyles}
        contentLabel="Preview"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-2 bg-gray-800 text-white">
            <h2 className="text-lg font-semibold">Website Preview</h2>
            <button
              onClick={closeModal}
              className="text-xl font-bold bg-red-700 w-8 h-8 rounded flex justify-center items-center"
            >
              X
            </button>
          </div>
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Website Preview"
          />
        </div>
      </Modal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => renderOption(option, index))}
      </div>
    </>
  );
};

export default TaskOptions;
