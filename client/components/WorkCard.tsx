const WorkCard = ({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) => {
  return (
    <div className="border flex flex-col justify-center items-start gap-3 w-80 p-4">
      <span className="bg-white text-black rounded-full w-8 p-1 text-center font-bold">
        {number}
      </span>
      <h2 className="text-gray-300 text-lg font-semibold font-myFont2">
        {title}
      </h2>
      <p className="text-gray-300 font-myFont3 text-lg">{desc}</p>
    </div>
  );
};

export default WorkCard;
