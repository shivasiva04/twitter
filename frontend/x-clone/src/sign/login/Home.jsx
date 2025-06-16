import { IoIosSearch } from "react-icons/io";
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import nytech from '../../img/nytech.jpeg';
import { Posts } from './Posts';
import BaseUrl from '../../constant/Url';
import { SuggestUser } from "./SuggestUser.jsx";
import { CreatePost } from "./CreatePost.jsx";
import { PeopleProfile } from "./PeopleProfile.jsx";
import NotificationPage from "./NotificationPage.jsx";

export const Home = ({ notifi }) => {
  const [feedType, setFeedType] = useState('foryou');
  const [profileShow, setProfileShow] = useState(true);

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch(`${BaseUrl}/api/auth/getMe`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch auth user');
      return res.json();
    },
  });

  if (isLoading || !authUser) return <p>Loading...</p>;

  const fLetter = authUser?.username || '';
  const fname = fLetter[0]?.toUpperCase() || '?';

  return (
    <div className="lg:ml-80">
      {notifi && <NotificationPage />}

      {!notifi && profileShow && (
        <div className="flex flex-col border border-gray-200 w-full lg:w-[700px] lg:ml-[90px] px-3 sm:px-5">
          <div className="flex justify-around mt-5">
            <p onClick={() => setFeedType('foryou')} className={`cursor-pointer ${feedType === 'foryou' ? "border-b-4 border-blue-400" : "border-b-0"}`}>For you</p>
            <p onClick={() => setFeedType('following')} className={`cursor-pointer ${feedType === 'following' ? "border-b-4 border-blue-400" : "border-b-0"}`}>Following</p>
          </div>

          <div className='mt-3 ml-2 flex'>
            <p className='bg-fuchsia-950 mt-3 text-white h-7 w-7 rounded-3xl text-center font-bold'>{fname}</p>
            <p className='mt-3 ml-2 text-xl text-gray-500'>What is happening?!</p>
          </div>

          {feedType === 'foryou' && <CreatePost />}
          <Posts feedType={feedType} />
        </div>
      )}

      {!profileShow && <PeopleProfile profileShow={profileShow} setProfileShow={setProfileShow} />}
<div className="hidden lg:flex flex-col fixed top-0 right-0 w-[400px] p-5 h-screen overflow-y-auto">
  <div className='flex relative'>
    <IoIosSearch className='absolute scale-110 text-gray-400 mt-3 ml-5' />
    <input
      type="text"
      placeholder='Search'
      className='border border-gray-300 rounded-3xl w-[300px] h-10 pl-11'
    />
  </div>

  <div>
    <h1 className='text-2xl font-bold mt-8 scale-95'>Subscribe to Premium</h1>
    <p className='w-80 mt-2 ml-2'>
      Subscribe to unlock new features and if eligible, receive a share of revenue.
    </p>
    <button className='bg-blue-400 mt-4 ml-2 text-white w-30 h-9 rounded-3xl'>
      Subscribe
    </button>
  </div>

  <div className='mt-5'>
    <h1 className='text-2xl font-bold'>What’s happening</h1>
    <div className='flex mt-2'>
      <img src={nytech} className='w-20 h-15' alt="nytech" />
      <div className='ml-3'>
        <p className='font-bold scale-90'>NY Tech Week: Official Launch</p>
        <p className='scale-75'>LIVE</p>
      </div>
    </div>
  </div>

  <SuggestUser setProfileShow={setProfileShow} profileShow={profileShow} />

  <div className='scale-75 mt-5'>
    <div className='flex gap-5'>
      <p className='border-r pr-5'>Terms of Service</p>
      <p className='border-r pr-5'>Privacy Policy</p>
      <p>Cookie Policy</p>
    </div>
    <div className='flex gap-5'>
      <p className='border-r pr-5'>Accessibility</p>
      <p className='border-r pr-5'>Ads info</p>
      <p>More.... @2025 X Corp</p>
    </div>
  </div>
</div>

    </div>
  );
};
