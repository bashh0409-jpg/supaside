import React from 'react'
import { BiArrowToTop, BiX } from "react-icons/bi";

const CloseButton = () => {
  return (
   
      <button className=" className='absolute text-white fixed z-9999 right-5 p-1 cursor-pointer hover:bg-zinc-600 rounded-lg bottom-5 bg-black">
        <BiX className='' size={45}/>
      </button>
    
  );
}

export default CloseButton