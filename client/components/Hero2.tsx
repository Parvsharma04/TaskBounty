const Hero2Page = () => {
  return (
    <div className="bg-black">
      <section
        id="features"
        className="relative block px-6 py-10 md:py-20 md:px-10  border-t border-b border-neutral-900 bg-neutral-900/30"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
            Why Choose Us?
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400 text-xl">
            Decentralized, Secure, and Efficient
          </p>
        </div>
        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
            <div
              className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
              style={{
                backgroundImage:
                  "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                borderColor: "rgb(93, 79, 240)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-color-swatch"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2" />
                <path d="M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9" />
                <path d="M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12" />
                <line x1={17} y1={17} x2={17} y2="17.01" />
              </svg>
            </div>
            <h3 className="mt-6 text-gray-400">Earn While You Work</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
              Complete tasks and earn 0.0002 Solana for every job you finish,
              ensuring fair compensation for your efforts.
            </p>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
            <div
              className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
              style={{
                backgroundImage:
                  "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                borderColor: "rgb(93, 79, 240)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-bolt"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="13 3 13 10 19 10 11 21 11 14 5 14 13 3" />
              </svg>
            </div>
            <h3 className="mt-6 text-gray-400">Client-Friendly Interface</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
              Easily post tasks and manage projects with our intuitive dashboard
              designed for seamless client experience.
            </p>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
            <div
              className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
              style={{
                backgroundImage:
                  "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                borderColor: "rgb(93, 79, 240)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-tools"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
                <line x1="14.5" y1="5.5" x2="18.5" y2="9.5" />
                <polyline points="12 8 7 3 3 7 8 12" />
                <line x1={7} y1={8} x2="5.5" y2="9.5" />
                <polyline points="16 12 21 17 17 21 12 16" />
                <line x1={16} y1={17} x2="14.5" y2="18.5" />
              </svg>
            </div>
            <h3 className="mt-6 text-gray-400">Transparent Payments</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
              Track your earnings and payouts in real-time, ensuring
              transparency and trust in every transaction.
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 z-0 h-1/3 w-full border-b"
          style={{
            backgroundImage:
              "linear-gradient(to right top, rgba(79, 70, 229, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(92, 79, 240, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 z-0 h-1/3 w-full"
          style={{
            backgroundImage:
              "linear-gradient(to left top, rgba(220, 38, 38, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(92, 79, 240, 0.2)",
          }}
        ></div>
      </section>
    </div>
  );
};

export default Hero2Page;
