export default function HelpCenterTab() {
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
       <div className="flex flex-col">
         <p className="text-sm font-semibold">Help Center</p>
       </div>
     </div>
   </div>
 );
}
