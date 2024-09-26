import TaskImage from "../TaskImage";

interface Option {
  id: number;
  image_url: string;
}

interface TaskOptionsProps {
  option: Option;
  onSelect: () => void;
}

const TaskOptions: React.FC<TaskOptionsProps> = ({ option, onSelect }) => {
  return (
    <div onClick={onSelect} className="cursor-pointer">
      <TaskImage
        imageUrl={option.image_url}
      />
    </div>
  );
};

export default TaskOptions;
