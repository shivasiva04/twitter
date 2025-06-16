// App.jsx
import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './sign/login/SignUp.jsx';
import { Login } from './sign/login/Login.jsx';
import { Front } from './sign/login/Front.jsx';
import { useQuery } from '@tanstack/react-query';
import BaseUrl from "./constant/Url.jsx";
import { Settings } from './sign/login/Settings.jsx';
import { Home } from './sign/login/Home.jsx';
import { useState } from 'react';

const App = () => {
  const [noti, setNoti] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch(`${BaseUrl}/api/auth/getMe`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || data.error) return null;
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  if (isLoading) return <div>Loading...</div>;

  if (authUser?.isBlocked) return <Navigate to="/login" replace />;

  return (
    <Router>
      <div className='flex absolute bg-white '>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="lg:hidden fixed w-8   h-10 top-4 left-2 z-51 bg-white border border-gray-300 rounded p-2 shadow-md"
        >
          ☰
        </button>

        {authUser && <Settings showSidebar={showSidebar} setNoti={setNoti} noti={noti} />}
        {authUser ? <Home notifi={noti} /> : ''}
      </div>

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/signup" element={!authUser ? <SignUp /> : ''} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={!authUser ? <Front /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
