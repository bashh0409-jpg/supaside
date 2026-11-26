interface SizeProps {
  size: string;
  available: boolean;
  selected: boolean;
  onSelect: (size: string) => void;
}

const Size = ({ size, available, selected, onSelect }: SizeProps) => {
  return (
    <button
      type="button"
      aria-label={`UK size ${size}, ${available ? "available" : "sold out"}`}
      aria-pressed={selected}
      disabled={!available}
      onClick={() => onSelect(size)}
      className={`flex aspect-square duration-500 w-10 items-center justify-center border-2 border-dashed text-lg font-bold ${
        !available
          ? "cursor-not-allowed border-black/10 text-black/30 line-through"
          : selected
            ? "cursor-pointer border-black bg-black text-white"
            : "cursor-pointer border-black/10 hover:border-black/40"
      }`}
    >
      {size}
    </button>
  );
};

export default Size;