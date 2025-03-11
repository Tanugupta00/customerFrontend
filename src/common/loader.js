import { BiLoaderCircle } from "react-icons/bi";
import React from 'react'

const Loader = () => {
    return (
        <div className='h-full w-full absolute top-[0] left-[0] bg-[#aaaaaa9e] z-[11] flex justify-center items-center'>
            <BiLoaderCircle  color="secondary" />
        </div>
    )
}

export default Loader;