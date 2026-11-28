import ShippingDetails from "./ShippingDetails";

type ShippingTabProps = {
  userId: string;
};

export default function ShippingTab({ userId }: ShippingTabProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <figure>
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </figure>
      <div className="col-span-2 w-full">
        <ShippingDetails userId={userId} />
      </div>
    </div>
  );
}
