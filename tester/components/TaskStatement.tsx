import { Chip } from "@nextui-org/react";
import React from "react";

interface TaskStatementProps {
  category: string;
  title: string;
  name?: string | null;
}

const TaskStatement: React.FC<TaskStatementProps> = ({
  category,
  title,
  name = null,
}) => {
  const getCategoryChip = (category: string) => {
    switch (category) {
      case "UI_UX_Design":
        return <Chip color="secondary">UI/UX</Chip>;
      case "Idea_Product":
        return <Chip color="warning">Idea/Product</Chip>;
      case "Youtube_Thumbnail":
        return <Chip color="danger">YouTube Thumbnail</Chip>;
      case "Miscellaneous":
        return <Chip color="primary">Miscellaneous</Chip>;
      default:
        return null;
    }
  };

  return (
    <div
      className="p-3 sm:p-4 mb-4 text-white bg-gray-800 rounded-2xl w-full"
      role="alert"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        {name && (
          <span className="text-base sm:text-lg font-medium px-2 py-0.5 rounded bg-green-900 text-green-300 whitespace-nowrap">
            {name}
          </span>
        )}
        <span className="text-lg sm:text-xl md:text-2xl font-medium flex-grow text-center sm:text-left">
          {title}
        </span>
        <div className="self-center sm:self-auto mt-2 sm:mt-0">
          {getCategoryChip(category)}
        </div>
      </div>
    </div>
  );
};

export default TaskStatement;
