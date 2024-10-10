const Table = () => {
  return (
    <div className="bg-gray-950 text-white flex justify-center items-center md:h-screen">
      <table className="border-collapse text-center mx-6 md:mx-0">
        <thead>
          <tr>
            <th className="border p-5 bg-blue-700 text-lg">Amount (SOL)</th>
            <th className="border p-5 bg-blue-700 text-lg">Votes</th>
            <th className="border p-5 bg-blue-700 text-lg">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-4">5</td>
            <td className="border p-4">25000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">10</td>
            <td className="border p-4">50000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">15</td>
            <td className="border p-4">75000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">20</td>
            <td className="border p-4">100000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">50</td>
            <td className="border p-4">250000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
