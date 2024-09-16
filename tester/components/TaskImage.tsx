export function TaskImage({
  imageUrl,
  onSelect,
}: {
  imageUrl: string;
  onSelect: () => void;
}) {
  return (
    <div className="relative w-[200px] h-[250px] rounded-[20px] bg-gray-800 shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-90">
      <img
        onClick={onSelect}
        className="rounded-t-lg w-full h-full object-cover p-8 sm:p-3 md:p-3"
        src={imageUrl}
        alt="task image"
      />
    </div>
  );
}

export default TaskImage;
