export function TaskImage({
  imageUrl,
  onSelect,
}: {
  imageUrl: string;
  onSelect: () => void;
}) {
  return (
    <div className="w-full max-w-sm border shadow bg-gray-800 border-gray-700 rounded-2xl">
      <img
        onClick={onSelect}
        className="p-8 rounded-t-lg"
        src={imageUrl}
        alt="product image"
      />
    </div>
  );
}

export default TaskImage;
