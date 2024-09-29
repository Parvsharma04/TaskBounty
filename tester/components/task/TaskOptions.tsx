import { useState } from "react";
import TaskImage from "../TaskImage";
import Modal from "react-modal";

interface Option {
  votingTypeDetails: any;
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

  const handleCheckboxChange = (idx: number) => {
    setTaskOptionSelect(idx); // Only the clicked checkbox will be selected
  };
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

  return (
    <>
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
      {option.image_url
        ? option.image_url.map((url: string, idx) => (
            <div className="cursor-pointer relative" key={idx}>
              <input
                id={`default-checkbox-${idx}`}
                type="checkbox"
                name="default-checkbox"
                value="1"
                checked={taskOptionSelect === idx} // Checkbox is checked if this is the selected one
                onChange={() => handleCheckboxChange(idx)}
                className="w-16 h-16 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 absolute top-1/3 left-1/3 z-50"
              />
              <label htmlFor={`default-checkbox-${idx}`}>
                {category == "UI_UX_Design" ? (
                  <button
                    onClick={() => {
                      setUrl(url);
                      setUrl(url);
                      openModal();
                    }}
                    className="w-[200px] h-[250px] rounded-[20px] bg-gray-800 shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-90 text-white text-3xl"
                  >
                    Preview
                  </button>
                ) : (
                  <TaskImage imageUrl={url} />
                )}
              </label>
            </div>
          ))
        : option.votingTypeDetails &&
          Object.entries(option.votingTypeDetails).map(
            (detail: any, idx: number) => (
              <div className="cursor-pointer" key={idx}>
                {detail}
              </div>
            )
          )}
    </>
  );
};

export default TaskOptions;
