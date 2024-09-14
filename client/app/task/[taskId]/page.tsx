"use client";

import TaskCard from "@/components/TaskCard";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
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

  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected, router]);

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
    <div className="bg-black text-white h-screen w-full flex flex-col justify-center items-center">
      <div className="capitalize font-semibold text-3xl flex justify-center">
        {taskDetails.title}
      </div>
      <div className="flex flex-wrap justify-center pt-8 gap-5">
        {Object.keys(result || {}).map((taskId) => (
          <Task
            key={taskId}
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
