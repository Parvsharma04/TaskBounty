const TaskStatement = ({ taskTitle }: { taskTitle: string }) => {
  return (
    <>
      <div
        className="p-4 mb-4 text-sm text-white bg-gray-800 rounded-2xl w-[100%]"
        role="alert"
      >
        <span className="text-xl font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300">
          Bounty :
        </span>
        <span className="inline-block w-fit text-center text-2xl">{taskTitle}</span>
      </div>
    </>
  );
};

export default TaskStatement;
