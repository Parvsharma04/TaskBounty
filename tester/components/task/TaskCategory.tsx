interface TaskCategoryProps {
  category: string;
  title: string;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ category, title }) => {
  return (
    <div className="text-center mb-4">
      {/* Bounty Chip */}
      <span className="text-lg sm:text-xl bg-blue-500 px-4 py-2 rounded-md">
        Bounty: {category}
      </span>

      {/* Task Title */}
      <div className="mt-2 text-2xl sm:text-3xl font-semibold">
        {title}
      </div>
    </div>
  );
};

export default TaskCategory;
