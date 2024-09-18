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
import LoadingPage from "./Loading";
import * as motion from "framer-motion/client";

function TaskAnalytics() {
  const [AllTasks, setAllTasks] = useState([]);
  const [amtSpent, setAmtSpent] = useState("0.0");
  const [totalTasks, setTotalTasks] = useState(0);
  const [doneTasks, setDoneTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const wallet = useWallet();
  const Router = useRouter();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/v1/user/getAllTask`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (res.status === 200) {
          // toast.success(res.data.message, {
          //   position: "top-left",
          //   autoClose: 1100,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "colored",
          // });
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
      setLoading(false);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!wallet.connected) {
      Router.replace("/");
    }
  }, [wallet.connected, Router]);

  const customStyles = {
    body: {
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    },
    header: {
      style: {
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center" as "center",
        fontSize: "2rem",
        padding: "1rem",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    },
    headCells: {
      style: {
        color: "#fff",
        border: "1px solid #fff",
        fontSize: "1.2rem",
      },
    },
    rows: {
      style: {
        fontFamily: "baloo-bhai-2",
        backgroundColor: "#000",
        color: "#fff",
        fontSize: "20px",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#1A56DB",
        color: "#fff",
      },
    },
    cells: {
      style: {
        border: "1px solid #fff",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
      pageButton: {
        style: {
          border: "1px solid #fff",
        },
      },
    },
  };

  const DataManipulation = (data: any) => {
    let total = 0.0;
    let done = 0;
    let pending = 0;

    data.forEach((task: any) => {
      const taskAmount = Number(task.amount);
      total += taskAmount / 1000000000;

      if (task.done === true) {
        done += 1;
      } else {
        pending += 1;
      }
    });

    setAmtSpent(total.toFixed(6));
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
      name: "Id",
      selector: (row: Task) => row.id,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row: Task) => row.title,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: Task) => row.amount,
      sortable: true,
    },
    {
      name: "Done",
      selector: (row: Task) => (row.done == false ? "Not Done" : "Done"),
      sortable: true,
    },
    {
      name: "Options",
      selector: (row: Task) => row.options[0].image_url,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Task) => <Link href={`/task/${row.id}`}>View Details</Link>,
    },
  ];

  return (
    <div className="h-screen bg-black text-white">
      {Loading && <LoadingPage />}
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
      {!Loading && (
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
      )}
      {!Loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <section className="p-6 pb-0 bg-black text-white">
            {AllTasks.length > 0 && <ChartAnalytics userTasks={AllTasks} />}
          </section>
        </motion.div>
      )}
      {!Loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <section className="bg-black text-white pt-10 pb-10">
            {AllTasks.length > 0 ? (
              <div className="flex flex-col justify-center items-center bg-black text-white border ml-6 mr-6">
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
              <div className="flex justify-center items-center text-3xl font-bold bg-black text-white md:h-1/2 w-full pb-10">
                No Data Found
              </div>
            )}
          </section>
        </motion.div>
      )}
    </div>
  );
}

export default TaskAnalytics;
