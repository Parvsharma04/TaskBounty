"use client";
import Appbar from "@/components/Appbar";
import TaskCard from "@/components/TaskCard";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

async function getTaskDetails(taskId: string) {
  const response = await axios.get(
    `${BACKEND_URL}/v1/user/task?taskId=${taskId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data;
}

export default function Page({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  const [result, setResult] = useState<
    Record<
      string,
      {
        count: number;
        option: {
          imageUrl: string;
        };
      }
    >
  >({});
  const [taskDetails, setTaskDetails] = useState<{
    title?: string;
  }>({});

  useEffect(() => {
    //! adding polling logic
    getTaskDetails(taskId).then((data) => {
      setResult(data.result);
      setTaskDetails(data.taskDetails);
    });
    const timer = setTimeout(() => {
      getTaskDetails(taskId).then((data) => {
        setResult(data.result);
        setTaskDetails(data.taskDetails);
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [taskId]);

  return (
    <div>
      <div className="capitalize font-semibold text-3xl pt-32 flex justify-center">
        {taskDetails.title}
      </div>
      <div className="flex flex-wrap justify-center pt-8 gap-5">
        {Object.keys(result || {}).map((taskId) => (
          <Task
            imageUrl={result[taskId].option.imageUrl}
            votes={result[taskId].count}
          />
        ))}
      </div>
    </div>
  );
}

function Task({ imageUrl, votes }: { imageUrl: string; votes: number }) {
  return <TaskCard imageUrl={imageUrl} votes={votes} />;
}
