import { Chip } from "@nextui-org/react";

const TaskStatement = ({
  category,
  title,
  name,
}: {
  category: string;
  title: string;
  name: string;
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
      className="p-4 mb-4 text-sm text-white bg-gray-800 rounded-2xl w-full flex items-center"
      role="alert"
    >
      <span className="text-xl font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300">
        {name}
      </span>
      <span className="inline-block text-center text-2xl">{title}</span>
      <div className="ml-2">{getCategoryChip(category)}</div>
    </div>
  );
};

export default TaskStatement;
