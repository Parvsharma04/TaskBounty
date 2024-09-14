// import Loader from "../utils/loader.mp4";

const LoadingPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center absolute top-0 bg-black">
      <video autoPlay loop muted className="md:w-1/2 z-50">
        <source src="/loader.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default LoadingPage;
