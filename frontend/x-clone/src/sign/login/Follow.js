// Follow.js
import BaseUrl from "../../constant/Url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollowRemove = () => {
  const queryClient = useQueryClient();

  const { mutate: followRemove, isPending } = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(`${BaseUrl}/api/users/follow/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to follow/unfollow");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      console.error("Unfollow error:", err.message);
    },
  });

  return { followRemove, isPending };
};
