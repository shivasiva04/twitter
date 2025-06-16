import bgProfile from '../../img/noProfile-bg.jpg'
import noProfile from '../../img/no-profile.png'
import { IoIosMore } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState } from 'react';

export const PeopleProfile = ({profileShow,setProfileShow}) => {
    const [showFullImage, setShowFullImage] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);

    
  return (
    <> 
    <div className='ml-25  w-170 '>
        <div className='flex'>
            <FaArrowLeftLong onClick={(e)=>{
              e.preventDefault()
              setProfileShow(!profileShow)
              }}   className='cursor-pointer mt-4 ml-4 text-xl'/>
            <div className='ml-6'>
                <p className='font-bold text-xl'>Manikandan</p>
                <p className='scale-80 text-gray-500'>1.2k posts</p>
            </div>
        </div>

       <div className="relative w-full">
       <img src={bgProfile}  onClick={() => setShowFullImage(true)} className="w-full cursor-pointer h-50 object-cover" alt="Background" />
       <img
       src={noProfile}
       onClick={()=>setShowProfileImage(true)}
       className="w-44 h-44 cursor-pointer absolute top-25 ml-10 bg-white rounded-full border-4 border-white"
       alt="Profile" />
        
         {showFullImage && (
        <div
          className="fixed inset-0 backdrop-blur-[5px]   bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(!showFullImage)}
        >
          <img src={bgProfile} className="w-250 h-100 max-w-full max-h-full" alt="Full Profile" />
        </div>
      )}

          {showProfileImage && (
        <div
          className="fixed inset-0 backdrop-blur-[5px]  bg-opacity-80 flex items-center justify-center z-60"
          onClick={() => setShowProfileImage(!showProfileImage)}
        >
          <img src={noProfile} className="max-w-full max-h-full" alt="Full Profile" />
        </div>
      )}
      </div>


        <div className='flex justify-end gap-5 mt-2'>
            <IoIosMore className='border cursor-pointer mt-2 border-gray-300 p-1.5 rounded-3xl w-9 h-9 ' />
            <IoMdSearch className='border cursor-pointer mt-2 p-1.5 border-gray-300 rounded-3xl w-9 h-9' />
            <button className='bg-black cursor-pointer text-white w-22 h-10 rounded-3xl'>follow</button>
        </div>
        <div className='mt-4'>
            <p className='font-bold text-2xl'>Manikandan</p>
            <p className='text-gray-400'>@name</p>
            <p className='mt-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam ipsum fugit expedita, enim, itaque facere obcaecati veritatis blanditiis praesentium tempora a velit laboriosam est recusandae eaque aspernatur suscipit inventore deserunt.</p>
            <div className='flex mt-3'>
                <p>location</p>
                <p>joined july 2017</p>
            </div>

            <div className='flex mt-3 gap-5 '>
            <p>2 <span className='text-gray-400'>Following</span></p>
            <p>2.1k <span className='text-gray-400'>Followers</span></p>
            </div>
           
        </div>

        <div className='flex mt-3'>
            <img src={noProfile} className='w-5' alt="" />
            <p className='scale-75 '>Following by Modijiii</p>
        </div>



          <p className='ml-85'>NoPosts</p>

        

    </div>

 


  
    
    
    </>
  )
}
