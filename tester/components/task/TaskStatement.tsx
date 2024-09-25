interface TaskTitleProps {
  title: string;
}

const TaskTitle: React.FC<TaskTitleProps> = ({ title }) => {
  return <h2 className="text-2xl font-bold text-center">{title}</h2>;
};

export default TaskTitle;
