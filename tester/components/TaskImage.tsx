export function TaskImage({
  imageUrl,
  type,
  handleOptionSelect,
  idx,
}: {
  imageUrl: string;
  type: string;
  handleOptionSelect: (idx: number) => void;
  idx: number;
}) {
  return (
    <div
      className="relative md:w-[200px] md:h-[250px] rounded-[20px] bg-gray-800 shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-90"
      onClick={() => handleOptionSelect(idx)}
    >
      {type == "image_url" ? (
        <img
          onClick={() => handleOptionSelect(idx)}
          className="rounded-t-lg w-full h-full object-cover p-8 sm:p-3 md:p-3"
          src={imageUrl}
          alt="task image"
        />
      ) : (
        <div className="relative">
          <iframe
            src={imageUrl}
            className="w-[55vw] h-[55vh] rounded-2xl pointer-events-none" // Prevent interaction
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <div
            className="absolute inset-0"
            onClick={() => handleOptionSelect(idx)}
          ></div>{" "}
          {/* Transparent overlay */}
        </div>
      )}
    </div>
  );
}

export default TaskImage;
