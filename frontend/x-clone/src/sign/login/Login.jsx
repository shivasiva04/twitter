import { useState } from "react";
import BaseUrl from "../../constant/Url.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import logo from '../../img/twitter-logo.png';
import { toast, Toaster } from "react-hot-toast";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',  
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleNavigate = () => {
    navigate('/signup'); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate: login } = useMutation({
    mutationFn: async ({ email, password }) => {
      const url = `${BaseUrl}/api/auth/login`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); 

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    },
    onSuccess: (data) => {
      if (data?.isBlocked) {
        toast.error("Your account is blocked due to bad comments");
        return;
      }

      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      const msg = err.message;

      if (msg.includes("blocked")) {
        toast.error("Your account is blocked due to bad comments");
      } else {
        toast.error("Invalid email or password");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div>
        <img className="w-10 absolute top-10 left-20" src={logo} alt="Logo" />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md shadow-xl rounded-2xl bg-white">
          <div className="p-8">
            <h2 className="text-2xl cursor-pointer font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full h-10 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?
              <button
                onClick={handleNavigate}
                type="button"
                className="ml-1 cursor-pointer text-blue-600 hover:underline"
              >
                SignUp
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
