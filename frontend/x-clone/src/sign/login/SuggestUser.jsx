// import sachin from '../../img/sachin.jpg';

import BaseUrl from "../../constant/Url";
import { useQuery } from "@tanstack/react-query";
import {useFollow} from '../useFollow.js'
import postProfile from '../../img/profile-none.jpg'


export const SuggestUser = ({setProfileShow,profileShow}) => {
  

  const { data: suggestUsers } = useQuery({
    queryKey : ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch(`${BaseUrl}/api/users/suggested`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataCheck = await res.json();

      if (!res.ok) {
        throw new Error(dataCheck.error);
      }

      return dataCheck;
    },
   
  });

  const {follow,isPending} = useFollow(); 

  const profileOn = (e)=>{
    e.preventDefault();
    setProfileShow(!profileShow)

  }

    
  return (
    <>
      <div className=""> 
          <h1 className='text-xl mt-3  font-bold'>Who to follow</h1>
          {suggestUsers && suggestUsers.map((data, index) => (
            <div key={index} onClick={profileOn} className='flex relative justify-between'>
              <div className='mt-5 ml-3 flex'>
                <img src={postProfile} className="w-12 h-11 pt-1" alt="" />
               <div>
                <p>{data.fullname}</p>
                <p>{data.username}</p>
               </div>
                
              </div>
              <button onClick={(e)=>{
                e.preventDefault()
                follow(data._id)
              }}  className='bg-black hover:bg-blue-500 cursor-pointer transition-all duration-150 mt-5 text-white rounded-3xl w-20 h-8 mr-15 '>{isPending?"Following...":"follow"}</button>
            </div>
          ))}
          <p className='text-blue-600 cursor-pointer mt-2'>Show more</p>
        </div></>
  )
}
