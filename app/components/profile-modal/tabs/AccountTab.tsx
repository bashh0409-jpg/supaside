export default function AccountTab() {
  return (
    <div className="grid grid-cols-3  gap-4">
      <span>
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </span>
      <div className="col-span-2 grid grid-cols-2 w-full ">
        <div className="flex flex-col">
          <p className="text-sm font-semibold">A</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">B</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">C</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">D</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">E</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">F</p>
        </div>
      </div>
    </div>
  );
}
