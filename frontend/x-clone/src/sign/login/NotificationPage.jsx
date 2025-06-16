import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import BaseUrl from "../../constant/Url";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await fetch(`${BaseUrl}/api/notifications/GetNotification`, {
				method: "GET",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${BaseUrl}/api/notifications/DeleteNotification`, {
				method: "DELETE",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='flex-[4_4_0]  min-h-screen w-full max-w-full px-4'>
			<div className='flex lg:w-200 lg:ml-0 ml-15 flex-wrap justify-between items-center p-4 border-b border-gray-300'>
				<p className='font-bold text-lg'>Notifications</p>
				<div className='dropdown'>
					<div tabIndex={0} role='button' className='m-1'>
						<IoSettingsOutline className='w-5 h-5' />
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
					>
						<li>
							<a className="cursor-pointer" onClick={() => deleteNotifications()}>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>

			{isLoading && (
				<div className='flex justify-center h-full items-center'>
					<p>Loading...</p>
				</div>
			)}

			{!isLoading && notifications?.length === 0 && (
				<div className='text-center font-extrabold p-4'>No notifications 🤔</div>
			)}

			{console.log("Fetched notifications:", notifications)}

			{notifications?.map((notification) => (
				<div className='border-b w-full border-gray-300' key={notification._id}>
					<div className='flex flex-wrap gap-2 p-4 items-center'>
						{notification.type === "follow" && (
							<FaUser className='w-6 h-6 text-primary' />
						)}
						{notification.type === "like" && (
							<FaHeart className='w-6 h-6 text-red-500' />
						)}

						<Link
							to={`/profile/${notification.from?.username}`}
							className='flex gap-2 items-center'
						>
							<div className='avatar'>
								<div className='w-8 rounded-full'>
									<img
										src={notification.from?.profileImg || "/avatar-placeholder.png"}
										alt='Profile'
									/>
								</div>
							</div>
							<div className='flex flex-wrap gap-1 items-center text-sm sm:text-base'>
								<span className='font-bold'>@{notification.from?.username}</span>{" "}
								{notification.type === "follow"
									? "followed you"
									: "liked your post"}
							</div>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotificationPage;
