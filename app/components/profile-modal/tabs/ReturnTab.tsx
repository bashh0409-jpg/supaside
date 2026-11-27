export default function ReturnTab() {
   return (
     <div className="grid  grid-cols-3  gap-4">
       <span>
         <img
           src="/logo.jpg"
           className="w-50 aspect-[4/5] object-cover"
           alt="Profile Image"
         />
       </span>
       <div className="col-span-2  w-full ">
         <div className="flex h-full flex-col">
           <p className="mute text-xs font-semibold tracking-tight uppercase">
             You have no returned orders yet.
           </p>
         </div>
       </div>
     </div>
   );
}
