"use client";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingPage from "./Loading";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

const TransactionHistory = () => {
  interface Transaction {
    postDate: string;
    postMonth: string;
    postYear: string;
    amount: string;
    status: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please connect the wallet first");
    }

    helper();
  }, []);

  const helper = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/v1/user/transactions`,
        {},
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      setTransactions(res.data.transaction);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const getDate = (year: string, month: string, numDate: string) => {
    let date = new Date(Number(year), Number(month), Number(numDate));

    return date.toDateString();
  };
  const columns = [
    { key: "postDate", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="h-screen">
      <div className="mx-auto mt-8 max-w-screen-lg px-2">
        <div className="sm:flex sm:items-center sm:justify-between flex-col sm:flex-row mb-6">
          <p className="flex-1 text-xl font-bold text-white">Latest Payments</p>

          <div className="mt-4 sm:mt-0">
            <div className="flex items-center justify-start sm:justify-end">
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="mr-2 flex-shrink-0 text-sm font-medium text-white"
                >
                  {" "}
                  Sort by:{" "}
                </label>
                <select
                  name=""
                  className="sm: mr-4 block w-full whitespace-pre rounded-lg border p-1 pr-10 text-base outline-none focus:shadow sm:text-sm bg-gray-700 hover:bg-gray-600"
                >
                  <option className="whitespace-no-wrap text-sm">Recent</option>
                </select>
              </div>

              <button
                type="button"
                className="flex justify-center items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600"
              >
                <svg
                  className="mr-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    className=""
                  ></path>
                </svg>
                Export to CSV
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingPage />
        ) : (
          <Table
            aria-label="Client Transaction History"
            selectionMode="multiple"
            classNames={{
              table: "bg-black",
              th: "bg-gray-700 text-white text-md",
              wrapper: "p-0.5",
            }}
          >
            <TableHeader className="bg-blue-500">
              {columns.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody emptyContent={"No rows to display."}>
              {transactions.map((obj, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-white">
                    {getDate(obj.postYear, obj.postMonth, obj.postDate)}
                  </TableCell>
                  <TableCell className="text-white">
                    {Number(obj.amount) / 1000_000_000} SOL
                  </TableCell>
                  <TableCell className="text-white">
                    {obj.status ? "Success" : "Pending"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
