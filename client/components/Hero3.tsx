import Table from "./Table";
import WorkCard from "./WorkCard";

const Hero3Page = () => {
  return (
    <div className="flex justify-evenly items-center flex-wrap">
      <div className="left flex flex-col justify-center items-center gap-12 h-screen md:w-1/2">
        <div className="upper text-white text-center text-4xl font-myFont">
          <h1>How It Works</h1>
        </div>
        <div className="lower flex justify-center items-center gap-5 flex-wrap">
          <WorkCard
            number={1}
            title="Post Your Task"
            desc="Clients can easily post tasks with specific requirements and rewards in Solana."
          />
          <WorkCard
            number={2}
            title="Complete Task"
            desc="Workers can browse available tasks, select what suits them, and start earning."
          />
          <WorkCard
            number={3}
            title="Receive Your Payment"
            desc="Once tasks are completed, workers receive their payment instantly in Solana."
          />
        </div>
      </div>
      <div className="right">
        <Table />
      </div>
    </div>
  );
};

export default Hero3Page;
