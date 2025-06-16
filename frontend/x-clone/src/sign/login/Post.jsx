import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BaseUrl from "../../constant/Url";
import { FaRegComment } from "react-icons/fa6";
import { PiShareLight } from "react-icons/pi";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineSort } from "react-icons/md";
import postProfile from '../../img/profile-none.jpg';
import { useState } from "react";
import { useFollow } from "../useFollow";
import { toast } from 'react-hot-toast'; // install using: npm i react-hot-toast

export const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { follow } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const itsMyPost = authUser?._id === post?.user?._id;

  const { mutate: deletePost, isPending: deletePending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BaseUrl}/api/posts/deletePost/${post._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: LikedPost } = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`${BaseUrl}/api/posts/likeUnlikePost/${postId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Like failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: BadComment, isPending: commentPending } = useMutation({
  mutationFn: async ({ postId, text }) => {
    const res = await fetch(`${BaseUrl}/api/posts/PostComment/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to comment");
    return data; // may contain { warning: true }
  },
 onSuccess: (data) => {
  setText("");
  queryClient.invalidateQueries({ queryKey: ["posts"] });

  if (data.blocked) {
    toast.error("🚫 Your account is now blocked due to repeated violations.");
  } else if (data.warning) {
    toast.error("⚠️ Warning: Your comment may be inappropriate.");
  } else {
    toast.success("✅ Comment posted.");
  }
},
onError: (err) => {
  toast.error(err.message || "Failed to post comment");
}

});
console.log("isblocked",authUser.isBlocked)


  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      BadComment({ postId: post._id, text });
    }
  };

  const isLiked = post.likes.includes(authUser?._id);

  const getTimeAgo = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours > 24) return "days ago";
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  };

  const formattedTime = getTimeAgo(post.createdAt);
  const isFollowing = authUser?.following?.includes(post.user._id);

  return (
    <div className="hover:bg-gray-100 mb-4 p-4 border border-gray-200 rounded w-full max-w-full">
      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-2 items-center">
        <img src={postProfile} className="w-12 h-12 rounded-full" alt="" />
        <div className="flex flex-col">
          <p className="font-bold text-sm sm:text-base">{post.user.email}</p>
          <p className="text-xs text-gray-500">{post.user.username} · {formattedTime}</p>
        </div>

        {!itsMyPost && (
          <button
            onClick={(e) => {
              e.preventDefault();
              follow(post.user._id);
            }}
            className='bg-black hover:bg-blue-500 cursor-pointer transition-all duration-150 mt-5 text-white rounded-3xl w-20 h-8 ml-auto'
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Post Text */}
      {post.text && <p className="mb-2 text-sm sm:text-base break-words">{post.text}</p>}

      {/* Post Image */}
      {post.img && (
        <img src={post.img} alt="Post" className="w-full max-h-96 object-cover rounded" />
      )}

      {/* Delete Button */}
      {itsMyPost && (
        <button
          onClick={deletePost}
          disabled={deletePending}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm sm:text-base"
        >
          {deletePending ? "Deleting..." : "Delete"}
        </button>
      )}

      {/* Action Icons */}
      <div className="flex justify-between mt-4 text-sm sm:text-base">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <FaRegComment className="text-xl" />
          <span>{post.comments.length}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <PiShareLight className="text-xl" />
          <span>5</span>
        </div>

        <div className="flex items-center gap-1">
          <IoIosHeartEmpty
            onClick={() => LikedPost(post._id)}
            className={`text-xl cursor-pointer ${isLiked ? 'text-red-500 drop-shadow-[0_0_8px_red] animate-pulse' : ''}`}
          />
          <span>{post.likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MdOutlineSort className="text-xl" />
          <span>5</span>
        </div>
      </div>

      {/* Comments */}
      {isOpen && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
            rows="2"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 text-sm sm:text-base"
            disabled={!text || commentPending}
            onClick={handleSubmit}
          >
            {commentPending ? "Posting..." : "Post Comment"}
          </button>

          {post.comments.map((cmt, idx) => (
            <div key={idx} className="flex gap-2 items-start mt-3">
              <img src={postProfile} className="w-8 h-8 rounded-full" alt="comment user" />
              <div className="text-sm sm:text-base">
                <p className="font-semibold">{cmt.user?.username || "Unknown User"}</p>
                <p className="bg-gray-100 p-2 rounded">{cmt.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
