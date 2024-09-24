import Image from "next/image";
import "../styles/taskCard.css";

interface TaskCardProps {
  imageUrl: string;
  description: string;
  votes: number;
  category: string;
}

const TaskCard = ({
  imageUrl,
  description,
  votes,
  category,
}: TaskCardProps) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <h1></h1>
          <button className="btn btn-primary">Preview</button>
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
          <p className="description">{description}</p>
          <p>{category}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
