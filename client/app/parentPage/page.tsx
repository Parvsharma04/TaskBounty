import Image from "next/image";

const parentPage = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center gap-16 my-20 md:my-auto md:-mt-6">
      <h1 className="text-4xl text-center">
        Get Started with <span className="text-blue-600">TaskBounty</span>
      </h1>
      <div className="flex justify-center items-center px-0 md:px-64 flex-col md:flex-row">
        <div className="flex flex-col justify-center items-center gap-8 w-4/5 md:w-1/2">
          <Image
            src="/client_redirect_img.svg"
            alt="client redirect image"
            width={150}
            height={150}
          />
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-3xl">Create Tasks</h1>
            <p className="text-center">
              Post your tasks with confidence and watch them get completed
              quickly. At TaskBounty, your tasks become opportunities.
            </p>
            <button className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4">
              Create Client Account
            </button>
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-full md:w-5">
          <hr className="h-px md:h-72 w-72 md:w-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium  -translate-x-1/2 left-1/2 text-white bg-black">
            or
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-8 w-4/5 md:w-1/2">
          <Image
            src="/worker_redirect_img.svg"
            alt="worker redirect image"
            width={150}
            height={150}
          />
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-3xl">Make Money</h1>
            <p className="text-center">
              Make money in your spare time. Get paid for completing simple
              tasks.
            </p>
            <button className="bg-blue-700 text-white hover:bg-blue-600 p-2 rounded px-4">
              Create Client Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default parentPage;
