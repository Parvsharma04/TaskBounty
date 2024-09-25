const Loading = () => {
  return (
    <div className="loader-container min-h-screen flex justify-center items-center text-xl sm:text-2xl bg-black text-white">
      <img
        src="Animation - 1726225471232.gif"
        alt="Loading..."
        width={200}
        height={200}
      />
      {/* <img src="loading.gif" alt="Loading..." width={200} height={200}/> */}
    </div>
  );
};

export default Loading;
