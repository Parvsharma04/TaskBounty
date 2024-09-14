export function TaskImage({
  imageUrl,
  onSelect,
}: {
  imageUrl: string;
  onSelect: () => void;
}) {
  return (
    <div className="relative w-[200px] h-[250px] rounded-[20px] bg-gradient-to-b from-[rgba(58,56,56,0.623)] to-[rgb(31,31,31)] shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-90">
      <img
        onClick={onSelect}
        className="p-8 rounded-t-lg w-full h-full object-cover"
        src={imageUrl}
        alt="task image"
      />
    </div>
  );
}

export default TaskImage;
