import Card from "./Card";

const TeamPage = () => {
  return (
    <>
      <div className="h-fit bg-black flex flex-col items-center justify-center py-8 p-10 pb-[129px]">
        <h1 className="text-4xl text-white mb-8 text-center">
          Meet Our Dev Team
        </h1>
        <div className="flex flex-col md:flex-row gap-10">
          <Card
            title="Parv"
            linkedin="https://www.linkedin.com/in/parv-sharma-470498259/"
            github="https://github.com/Parvsharma04/"
            img="/images/parv.png"
          />
          <Card
            title="Arshdeep"
            linkedin="https://www.linkedin.com/in/arshdeeprooprai/"
            github="https://github.com/Arshdeep-13"
            img="/images/arsh.jpg"
          />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
