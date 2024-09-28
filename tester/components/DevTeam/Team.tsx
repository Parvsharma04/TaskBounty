import Card from "./Card";

const TeamPage = () => {
  return (
    <>
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex gap-72 justify-center">
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
