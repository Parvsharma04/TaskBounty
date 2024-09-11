import "../styles/taskCard.css";

interface TaskCardProps {
  imageUrl: string;
  votes: number;
}

const TaskCard = ({ imageUrl, votes }: TaskCardProps) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={imageUrl} className="p-3 rounded-3xl" alt="Task img" />
          <p className="title mt-3 text-black">
            <span>Votes: </span>
            {votes}
          </p>
        </div>
        <div className="flip-card-back">
          <p className="title">
            <span>Votes: </span>
            {votes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
