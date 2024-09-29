import Card from "./Card";

const TeamPage = () => {
  return (
    <>
<<<<<<< HEAD
      <div className="min-h-screen bg-black flex flex-col items-center justify-center py-8 pt-28">
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
=======
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex gap-72 justify-center">
          <Card />
          <Card />
>>>>>>> 5428654f372888fd6f6caf07fac11d7ee6aa8ff3
        </div>
      </div>
    </>
  );
};

export default TeamPage;
