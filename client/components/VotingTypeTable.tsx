import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function VotingTypeTable({ votingTypeDetails }: any) {
  return (
    <Table
      aria-label="Example empty table"
      classNames={{
        table: "bg-gray-900 overflow-hidden",
        th: "bg-gray-700 text-white text-md",
        wrapper: "p-0 bg-blue-500 overflow-hidden",
        tfoot: "hidden",
      }}
    >
      <TableHeader>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>VOTES</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {votingTypeDetails.map((val: any, idx: number) => {
          return (
            <TableRow key={idx}>
              <TableCell>{val.type}</TableCell>
              <TableCell>{val.votes}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
