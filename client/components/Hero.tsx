import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative pt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden opacity-35 h-screen">
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img1.png"
              alt="bg image 1"
              width={500}
              height={500}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg w-96"
              src="/img3.png"
              alt="bg image 3"
              width={300}
              height={500}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img4.png"
              alt="bg image 4"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img5.png"
              alt="bg image 5"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img6.png"
              alt="bg image 6"
              width={500}
              height={800}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img9.png"
              alt="bg image 7"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img8.png"
              alt="bg image 8"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img9.png"
              alt="bg image 9"
              width={500}
              height={800}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img15.png"
              alt="bg image 10"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img11.png"
              alt="bg image 11"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img12.png"
              alt="bg image 12"
              width={500}
              height={800}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-center absolute top-[35%] left-[28%]">
        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">
          Empower Your Data with{" "}
          <span className="text-blue-600">TaskBounty</span>
        </h1>
        <p className="max-w-2xl mb-6 font-light text-white lg:mb-8 md:text-lg lg:text-xl text-justify">
          Elevate your AI projects with TaskBounty's expert labeling services.
          We're more than just a platform; we're your partner in success
        </p>
        <div>
          <Link
            href="/uploadTask"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <Link
            href="/uploadTask"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-transparent border hover:bg-white hover:text-black focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Learn More
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
