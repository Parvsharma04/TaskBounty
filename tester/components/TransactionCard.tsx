import { Card, CardHeader } from "@nextui-org/react";
import Image from "next/image";

export default function TransactionCard({
  amount,
  status,
  date,
}: {
  amount: string;
  status: string;
  date: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="p-2">
      <Card className="relative w-full rounded-[20px] p-4 bg-gray-900 shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-95 text-white">
        <CardHeader className="flex gap-3">
          <Image
            alt="transaction status"
            height={40}
            src={
              status === "Success" ? "/images/check.png" : "/images/cross.png"
            }
            width={40}
            className="mr-4 ml-4 rounded-sm"
          />
          <div className="m-4">
            <p className="text-lg font-bold">{amount} SOL</p>
            <p
              className={`text-small ${
                status === "Success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status}
            </p>
          </div>
        </CardHeader>
        <div className="absolute bottom-2 right-4 text-small text-default-500">
          {formattedDate}
        </div>
      </Card>
    </div>
  );
}
