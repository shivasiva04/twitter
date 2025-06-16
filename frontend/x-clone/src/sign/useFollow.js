import BaseUrl from "../constant/Url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = ()=>{
      const queryClient = useQueryClient();
      
  const { mutate: follow } = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(`${BaseUrl}/api/users/follow/${userId}`, {
        method: "POST",
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }); // Refetch post list
    },
    onError: (err) => {
      console.error("follow error:", err.message);
    },
  });
  return {follow}


}
