import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"; // Updated imports
import Link from "next/link";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import TaskImage from "../TaskImage";

interface Option {
  votingTypeDetails: Record<string, any>;
  id: number;
  image_url: any;
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Use NextUI's useDisclosure
  const [url, setUrl] = useState("");
  const [isImage, setIsImage] = useState(true);

  const handleOptionSelect = (idx: number) => {
    setTaskOptionSelect(idx);
  };

  const openModal = (contentUrl: string, isImageContent: boolean) => {
    setUrl(contentUrl);
    setIsImage(isImageContent);
    onOpen(); // Open the modal
  };

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {category === "UI_UX_Design" && (
          <div
            className="relative cursor-pointer bg-gray-800 rounded-md p-4 transition-transform duration-300 hover:scale-105"
            onClick={() => {
              handleOptionSelect(option.id);
            }}
          >
            <div className="text-white font-medium">
              <span>Visit: </span>
              <Link
                href={option.image_url[0].image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400"
              >
                {option.image_url[0].image_url}
              </Link>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(option.image_url[0].image_url, false);
              }}
              className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
            >
              <FaEye size={18} />
            </button>
          </div>
        )}
        {category !== "UI_UX_Design" &&
          option.image_url &&
          option.image_url.map((imageUrl: any, idx: number) => (
            <div
              key={idx}
              className="relative flex-wrap flex justify-center items-center cursor-pointer bg-gray-900 rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 p-2"
              onClick={() => handleOptionSelect(idx)}
            >
              <TaskImage
                handleOptionSelect={handleOptionSelect}
                idx={idx}
                type={imageUrl.type}
                imageUrl={imageUrl.image_url}
              />
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
                  openModal(imageUrl.image_url, imageUrl.type === "image_url");
                }}
                className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white transition-colors hover:bg-gray-800"
              >
                <FaEye size={18} />
              </button>
            </div>
          ))}
      </div>

      {/* NextUI Modal for Image/Website Preview */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-gray-700 backdrop-blur-md p-5 w-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-right text-white">
                {" "}
                {/* Adjust text color for better visibility */}
                {isImage ? "Image Preview" : "Website Preview"}
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskOptions;
