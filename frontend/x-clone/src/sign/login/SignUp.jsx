import { useState } from "react";
import BaseUrl from "../../constant/Url.jsx";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import logo from '../../img/twitter-logo.png'

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: ""
  });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login'); 
  };





  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate : signup, isError, error } = useMutation({
    mutationFn: async ({ email, password, username,fullname }) => {
      const url = `${BaseUrl}/api/auth/signup`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, username,fullname }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }


      return data;
    },
    onSuccess: (data) => {
      console.log("Success:", data.email);
      navigate('/');
     
    },
    onError: (err) => {
      console.error("Mutation error:", err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };


  

  return (

    <>
         <div>
          <img className="w-10 absolute top-10 left-20" src={logo} alt="" />
        </div>


    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md shadow-xl rounded-2xl bg-white">
        <div className="p-8">
          <h2  className="text-2xl cursor-pointer font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
           
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
                required
              />

           
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
              <input
              type='text'
              name="fullname"
              placeholder="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
            <button
              type="submit"
              className="w-full h-10 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-semibold rounded-xl"
            >
              Sign Up
            </button>
          </form>
          {isError && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error.message}
            </p>
          )}
          <p className="mt-4 text-center text-sm text-gray-600">Already have an account?
           
            <button
              onClick={handleNavigate}

              type="button"
              className="ml-1 cursor-pointer text-blue-600 hover:underline"
            >Login</button>


          </p>
        </div>
      </div>
    </div>
    
    
    </>


  );
}

export default SignUp;
