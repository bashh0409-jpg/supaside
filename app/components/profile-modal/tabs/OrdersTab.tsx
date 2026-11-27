export default function OrdersTab() {
  return (
    <div className="grid grid-cols-3  gap-4">
      <span>
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </span>
      <div className="col-span-2  w-full ">
        <div className="flex h-full flex-col">
          <p className="text-xs flex mute font-mono uppercase bg-gray-10 capitalize font-medium">
            You have no orders yet.
          </p>
        </div>
      </div>
    </div>
  );
}
