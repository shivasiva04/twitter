import { useQuery} from '@tanstack/react-query';
import BaseUrl from '../../constant/Url';
import { Post } from './Post';
import { useFollowRemove } from './Follow.js';
export const Posts = ({ feedType }) => {

  const getPostEndPoint = () => {
    switch (feedType) {
      case 'foryou':
        return `${BaseUrl}/api/posts/allPosts`;
      case 'following':
        return `${BaseUrl}/api/posts/getFollowingPosts`;
      default:
        return `${BaseUrl}/api/posts/allPosts`;
    }
  };

  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`${BaseUrl}/api/auth/getMe`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', feedType],
    queryFn: async () => 
      {
      const res = await fetch(getPostEndPoint(), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error fetching posts');
      }
      return res.json();

    }

  });

const { followRemove } = useFollowRemove();
  return (
    <div className="mt-6  p-4">
      {isLoading && <p className="text-center mt-4">Loading posts...</p>}
      {error && <p className="text-center mt-4 text-red-600">Error loading posts: {error.message}</p>}
      {!isLoading && posts.length === 0 && (
        <p className="text-center mt-4 lg:ml-0  text-gray-500">No Posts</p>
      )}

      {
        feedType==='following' &&(
           <div className="mb-6 lg:ml-0  ml-15">
        <h2 className="text-lg font-semibold mb-2">You're following:</h2>
        {authLoading && <p>Loading your following...</p>}
        {authUser?.following?.length > 0 ? (
          authUser.following.map((user, index) => (
            <div key={index} className="p-2 border rounded mb-2">
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-500">{user.email}</p>
              <button onClick={(e)=>{
                e.preventDefault()
                followRemove(user._id)
              }} className='bg-black text-white rounded-2xl w-30 cursor-pointer'>Unfollow</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You're not following anyone yet.</p>
        )}
      </div>


        )



      }

     

      {posts.map((postData) => (
        <Post key={postData._id} post={postData} feedType={feedType} />
      ))}
    </div>
  );
};
