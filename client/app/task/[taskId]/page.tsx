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
  interface CategoryDetails {
    Design_Title: string;
    Design_Description: string;
    Design_Url: string[];
    Idea_Images: string[];
    Youtube_Thumbnail_Images: string[];
    Images: string[];
  }
  interface TaskDetailsProps {
    amount: String;
    category: string;
    done: Boolean;
    postDate: Number;
    postMonth: Number;
    postYear: Number;
  }

  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps>({
    amount: "",
    category: "",
    done: false,
    postDate: 0,
    postMonth: 0,
    postYear: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [categoryDetails, setCategoryDetails] =
    useState<CategoryDetails | null>(null);

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
      console.log(data);
      setTaskDetails(data.taskDetails);
      setSubmissions(data.responses);
      setCategoryDetails(data.categoryDetails);
    });
    const timer = setTimeout(() => {
      getTaskDetails(taskId).then((data) => {
        setSubmissions(data.responses);
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
        {categoryDetails?.Design_Title ?? "Task"}{" "}
        {" " + taskDetails?.category ?? ""}
      </div>
      <div className="flex flex-wrap justify-center pt-8 gap-5">
        {taskDetails.category === "UI_UX_Design" &&
          categoryDetails?.Design_Url.map((url, idx) => (
            <Task
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={0}
              category={taskDetails?.category ?? ""}
            />
          ))}
        {taskDetails.category === "Idea_Product" &&
          categoryDetails?.Idea_Images.map((url, idx) => (
            <Task
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={0}
              category={taskDetails?.category ?? ""}
            />
          ))}
        {taskDetails.category === "Youtube_Thumbnail" &&
          categoryDetails?.Youtube_Thumbnail_Images.map((url, idx) => (
            <Task
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={0}
              category={taskDetails?.category ?? ""}
            />
          ))}
        {taskDetails.category === "Miscellaneous" &&
          categoryDetails?.Images.map((url, idx) => (
            <Task
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={0}
              category={taskDetails?.category ?? ""}
            />
          ))}
        {taskDetails.category === "Miscellaneous" &&
          categoryDetails?.Design_Url.map((url, idx) => (
            <Task
              key={idx}
              imageUrl={url ?? ""}
              description={categoryDetails?.Design_Description ?? ""}
              votes={0}
              category={taskDetails?.category ?? ""}
            />
          ))}
      </div>
    </div>
  );
}

function Task({
  imageUrl,
  description,
  votes,
  category,
}: {
  imageUrl: string;
  description: string;
  votes: number;
  category: string;
}) {
  return (
    <TaskCard
      imageUrl={imageUrl}
      votes={votes}
      description={description}
      category={category}
    />
  );
}
