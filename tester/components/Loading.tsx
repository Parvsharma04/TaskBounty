import Image from "next/image";

const Loading = () => {
  return (
    <div className="loader-container min-h-screen flex justify-center items-center text-xl sm:text-2xl bg-black text-white">
      <Image
        src="/animation - 1726225471232.gif"
        alt="Loading..."
        width={200}
        height={200}
      />
      {/* <Image src="loading.gif" alt="Loading..." width={200} height={200}/> */}
    </div>
  );
};

export default Loading;
