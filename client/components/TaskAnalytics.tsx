"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChartAnalytics from "./ChartAnalytics";
import TaskSummary from "./TaskSummary";

function TaskAnalytics() {
  const [AllTasks, setAllTasks] = useState([]);
  const [amtSpent, setAmtSpent] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [doneTasks, setDoneTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const wallet = useWallet();
  const Router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/v1/user/getAllTask`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (res.status === 200) {
          toast.success(res.data.message, {
            position: "top-left",
            autoClose: 1100,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        // console.log(res.data.tasksDetails);
        setAllTasks(res.data.tasksDetails);
        DataManipulation(res.data.tasksDetails);
      } catch (err: any) {
        console.log(err);
        toast.error(err.response.data.message, {
          position: "top-left",
          autoClose: 1100,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!wallet.connected) {
      Router.replace("/");
    }
  }, [wallet.connected, Router]);

  const customStyles = {
    header: {
      style: {
        fontFamily: "Sans-serif",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f2f2f2",
        fontFamily: "Sans-serif",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontFamily: "Sans-serif",
      },
    },
    rows: {
      style: {
        fontFamily: "baloo-bhai-2",
        fontSize: "20px",
      },
    },
    pagination: {
      style: {
        fontFamily: "Sans-serif",
      },
    },
  };
  const DataManipulation = (data: any) => {
    let total = 0;
    let done = 0;
    let pending = 0;
    data.map((task: any) => {
      total += task.amount;
      if (task.done == true) {
        done += 1;
      } else {
        pending += 1;
      }
    });

    setAmtSpent(total);
    setTotalTasks(data.length);
    setDoneTasks(done);
    setPendingTasks(pending);
  };

  interface Task {
    id: string;
    title: string;
    amount: string;
    done: boolean;
    options: { image_url: string }[];
  }

  const columns = [
    {
      name: "id",
      selector: (row: Task) => row.id,
      sortable: true,
    },
    {
      name: "title",
      selector: (row: Task) => row.title,
      sortable: true,
    },
    {
      name: "amount",
      selector: (row: Task) => row.amount,
      sortable: true,
    },
    {
      name: "done",
      selector: (row: Task) => (row.done == false ? "Not Done" : "Done"),
      sortable: true,
    },
    {
      name: "options",
      selector: (row: Task) => row.options[0].image_url,
      sortable: true,
    },
    {
      name: "actions",
      cell: (row: Task) => <Link href={`/task/${row.id}`}>View Details</Link>,
    },
  ];

  return (
    <div className=" pt-28">
      <ToastContainer
        position="top-left"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <TaskSummary
        amtSpent={amtSpent}
        totalTasks={totalTasks}
        doneTasks={doneTasks}
        pendingTasks={pendingTasks}
        prevAmtSpent={10}
        prevTotalTasks={1}
        prevDoneTasks={3}
        prevPendingTasks={3}
      />
      <div className="p-6 pb-0 bg-black text-white">
        {AllTasks.length > 0 && <ChartAnalytics userTasks={AllTasks} />}
      </div>
      <div>
        {AllTasks ? (
          <div className="p-12 pt-0 flex flex-col justify-center items-center">
            <DataTable
              customStyles={customStyles}
              className="dataTables_wrapper"
              title="Client Task Analytics"
              columns={columns}
              data={AllTasks}
              fixedHeader
              pagination
              responsive
              highlightOnHover
              pointerOnHover
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="text-3xl font-bold text-gray-500">
              No Data Found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskAnalytics;
