"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

function taskAnalytics() {
  const [AllTasks, setAllTasks] = useState([]);
  const wallet = useWallet();
  const Router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/v1/user/getAllTask`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

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
  }, [wallet.connected]);

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

  const columns = [
    {
      name: "id",
      selector: (row: { id: any }) => row.id,
      sortable: true,
    },
    {
      name: "title",
      selector: (row: { title: any }) => row.title,
      sortable: true,
    },
    {
      name: "amount",
      selector: (row: { amount: any }) => row.amount,
      sortable: true,
    },
    {
      name: "done",
      selector: (row: { done: any }) =>
        row.done == false ? "Not Done" : "Done",
      sortable: true,
    },
    {
      name: "options",
      selector: (row: { options: any }) => row.options[0].image_url,
      sortable: true,
    },
    {
      name: "actions",
      cell: (row: { id: any }) => (
        <Link href={`/task/${row.id}`}>View Details</Link>
      ),
    },
  ];

  return (
    <div className=" pt-10">
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
      {AllTasks ? (
        <div className="p-12 flex flex-col justify-center items-center">
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
          <div className="text-3xl font-bold text-gray-500">No Data Found</div>
        </div>
      )}
    </div>
  );
}

export default taskAnalytics;
