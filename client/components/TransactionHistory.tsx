"use client";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingPage from "./Loading";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [requiredPayments, setRequiredPayments] = useState("All");
  const [page, setPage] = useState(1);
  const rowPerPage = 8;

  const pages = Math.ceil(transactions.length / rowPerPage);

  const items = useMemo(() => {
    let start = (page - 1) * rowPerPage;
    let end = start + rowPerPage;
    return transactions.slice(start, end);
  }, [page, transactions]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please connect the wallet first");
    }

    helper();
  }, []);
  useEffect(() => {
    if (requiredPayments === "All") {
      helper();
    } else {
      setLoading(true);
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      let { start, end } = getPreviousWeek();

      let filteredTransactions = transactions.filter((transaction) => {
        if (requiredPayments === "Recent") {
          return (
            transaction.postYear.toString() === year.toString() &&
            transaction.postMonth.toString() === month.toString() &&
            transaction.postDate.toString() === day.toString()
          );
        } else if (requiredPayments === "Previous Day") {
          return (
            transaction.postYear.toString() === year.toString() &&
            transaction.postMonth.toString() === month.toString() &&
            transaction.postDate.toString() === (day - 1).toString()
          );
        } else if (requiredPayments === "Previous Month") {
        } else if (requiredPayments === "Previous Week") {
          return (
            transaction.postYear.toString() == year.toString() &&
            transaction.postMonth.toString() == month.toString() &&
            transaction.postDate.toString() >= start.getDate().toString() &&
            transaction.postDate.toString() <= end.getDate().toString()
          );
        } else if (requiredPayments === "Previous Month") {
          return (
            transaction.postYear.toString() === year.toString() &&
            transaction.postMonth.toString() === (month - 1).toString()
          );
        } else if (requiredPayments === "Previous Year") {
          return transaction.postYear.toString() === (year - 1).toString();
        }
      });
      setTimeout(() => {
        setTransactions(filteredTransactions);
      }, 1000);
      setLoading(false);
    }
  }, [requiredPayments]);

  interface Transaction {
    postDate: string;
    postMonth: string;
    postYear: string;
    amount: string;
    status: boolean;
    category: string;
  }

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

      res.data.transaction.reverse();
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
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];
  const handlePdfDownload = async () => {
    const doc = new jsPDF();

    doc.text("Transaction History", 80, 15);

    const headers = columns.map((column) => column.label);
    const data = transactions.map((transaction) => [
      getDate(
        transaction.postYear.toString(),
        transaction.postMonth.toString(),
        transaction.postDate.toString()
      ),
      (Number(transaction.amount) / 1000_000_000).toFixed(3) + " SOL",
      transaction.category,
      transaction.status ? "Success" : "Pending",
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      theme: "grid",
      styles: { halign: "center", cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
      tableWidth: doc.internal.pageSize.getWidth() - 20,
      margin: { left: 10 },
    });

    doc.save(
      `${localStorage
        .getItem("token")
        ?.substring(0, 8)}-transaction-history.pdf`
    );
  };
  function getPreviousWeek() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const startOfLastWeek = new Date(
      lastWeek.getFullYear(),
      lastWeek.getMonth(),
      lastWeek.getDate() - lastWeek.getDay()
    );
    const endOfLastWeek = new Date(
      lastWeek.getFullYear(),
      lastWeek.getMonth(),
      lastWeek.getDate() - lastWeek.getDay() + 6
    );

    return {
      start: startOfLastWeek,
      end: endOfLastWeek,
    };
  }

  return (
    <div className="h-screen bg-gray-950">
      <div className="mx-auto mt-8 max-w-screen-lg px-2 flex flex-col gap-12">
        <div className="sm:flex sm:items-center sm:justify-between flex-col sm:flex-row mb-6">
          <p className="flex-1 text-center md:text-start text-4xl md:text-xl font-bold text-white py-8 md:py-0">
            Latest Payments
          </p>

          <div className="mt-4 sm:mt-0">
            <div className="flex flex-wrap justify-center gap-5 md:gap-0 items-center md:justify-start sm:justify-end">
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="mr-2 flex-shrink-0 text-xl md:text-base font-medium text-white"
                >
                  {" "}
                  Sort by:{" "}
                </label>
                <select
                  value={requiredPayments}
                  onChange={(e) => setRequiredPayments(e.target.value)}
                  className="sm: mr-4 block w-full whitespace-pre rounded-lg border p-2 pr-10 text-base outline-none focus:shadow sm:text-sm bg-gray-700 hover:bg-gray-600"
                >
                  <option className="whitespace-no-wrap text-sm">All</option>
                  <option className="whitespace-no-wrap text-sm">Recent</option>
                  <option className="whitespace-no-wrap text-sm">
                    Previous Day
                  </option>
                  <option className="whitespace-no-wrap text-sm">
                    Previous Week
                  </option>
                  <option className="whitespace-no-wrap text-sm">
                    Previous Month
                  </option>
                  <option className="whitespace-no-wrap text-sm">
                    Previous Year
                  </option>
                </select>
              </div>

              <button
                type="button"
                className="flex justify-center items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600 text-base md:text-lg"
                onClick={handlePdfDownload}
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
          <div className="w-full overflow-scroll scrollbar-hide">
            <Table
              aria-label="Client Transaction History"
              classNames={{
                table: "bg-gray-950 w-[35rem] md:w-full gap-0",
                th: "bg-gray-700 text-white text-md",
                wrapper: "p-0.5 w-[35rem] md:w-full bg-blue-500 gap-0",
              }}
              ref={tableRef}
              bottomContent={
                <div className="flex w-full justify-center bg-gray-950">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    className="bg-gray-950 text-white mt-2 mb-2"
                    classNames={{
                      wrapper: "bg-gray-950 border md:p-1",
                      item: "bg-gray-950 text-white",
                      next: "bg-gray-950 text-white",
                      prev: "bg-gray-950 text-white",
                    }}
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
            >
              <TableHeader className="bg-blue-500">
                {columns.map((column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody emptyContent={"No rows to display."}>
                {items.map((obj, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-white text-base">
                      {getDate(obj.postYear, obj.postMonth, obj.postDate)}
                    </TableCell>
                    <TableCell className="text-white text-base">
                      {Number(obj.amount) / 1000_000_000} SOL
                    </TableCell>
                    <TableCell className="text-white text-base">
                      {obj.category}
                    </TableCell>
                    <TableCell className="text-white text-base">
                      {obj.status ? "Success" : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
