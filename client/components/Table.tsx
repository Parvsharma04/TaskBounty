const Table = () => {
  return (
    <div className="bg-black text-white flex justify-center items-center h-screen">
      <table className="border-collapse text-center">
        <thead>
          <tr>
            <th className="border p-5 bg-blue-700 text-lg">Amount ($)</th>
            <th className="border p-5 bg-blue-700 text-lg">Votes</th>
            <th className="border p-5 bg-blue-700 text-lg">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-4">5</td>
            <td className="border p-4">2500</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">10</td>
            <td className="border p-4">5000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">15</td>
            <td className="border p-4">7500</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">20</td>
            <td className="border p-4">10000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr>
            <td className="border p-4">50</td>
            <td className="border p-4">25000</td>
            <td className="border p-4">Any media upto 5Mb</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
