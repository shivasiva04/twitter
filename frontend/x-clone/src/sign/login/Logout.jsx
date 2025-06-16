import BaseUrl from "../../constant/Url.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { RiLogoutBoxLine } from "react-icons/ri";

export const Logout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      let data = {};
      try {
        data = await res.json();
      } catch (error) {
        console.warn(error,"No JSON in response");
      }

      if (!res.ok) throw new Error(data?.error || "Logout failed");
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ["getMe"] }); 
      queryClient.invalidateQueries({ queryKey: ["posts"] }); 

      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <RiLogoutBoxLine onClick={handleSubmit} className="cursor-pointer text-xl" />
  );
};
