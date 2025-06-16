import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
import cloudinary from '../Cloudinary.js';
import { isCommentInappropriate } from '../utils/moderateComment.js';


export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ error: 'Text or image is required' });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      // Upload buffer to Cloudinary with promise wrapper
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const newPost = new Post({
      user: req.user._id, // assuming req.user added by auth middleware
      text,
      img: imageUrl,
      imgPublicId: imagePublicId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized to delete this post" });
    }

    // Delete image from cloudinary if present (using publicId)
    if (post.imgPublicId) {
      try {
        await cloudinary.uploader.destroy(post.imgPublicId);
      } catch (error) {
        console.error("Cloudinary image delete failed:", error);
        // continue anyway, don't block post deletion
      }
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const postComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const inappropriate = isCommentInappropriate(text);

    // Check if user is already blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account has been blocked due to repeated inappropriate comments." });
    }

    if (inappropriate) {
      user.warningCount = (user.warningCount || 0) + 1;

      // Auto-block if warnings exceed 3
      if (user.warningCount >= 3) {
        user.isBlocked = true;
      }
      console.log(user.warningCount)


      await user.save();
    }

    // Add comment
    post.comments.push({ text, user: userId });
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "email username")
      .populate("user", "email username");

    res.status(200).json({
      post: updatedPost,
      warning: inappropriate ? true : false,
      message: user.isBlocked
        ? "User blocked due to repeated inappropriate comments"
        : "Comment added"
    });

  } catch (err) {
    console.error("Post comment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};



export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			return res.status(200).json({ message: "Post unliked successfully" });
		} else {
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			// ✅ Only create notification if user likes someone ELSE's post
			if (String(userId) !== String(post.user)) {
				const notification = new Notification({
					from: userId,
					to: post.user,
					type: 'like'
				});
				await notification.save();
			}

			return res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (error) {
		console.error("Error in likeUnlikePost:", error);
		return res.status(500).json({ error: "Internal server error in likeUnlikePost" });
	}
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "user", select: '-password' })
            .populate({ path: "comments.user", select: ['-password', '-email', '-following', '-followers', '-bio'] });

        res.status(200).json(posts);
    } catch (error) {
        console.log(`error in allPosts ${error}`);
        res.status(500).json({ error: "error in AllGetPost" });
    }
};

export const getLikedPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "user not found in getLikedPost" });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({ path: "user", select: '-password' })
            .populate({ path: "comments.user", select: ['-password', '-email', '-following', '-followers', '-bio'] });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log(`error in getLikedPost ${error}`);
        res.status(500).json({ error: "error in getLikedPost" });
    }
};

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "user not found in getFollowing" });
        }

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 })
            .populate({ path: "user", select: '-password' })
            .populate({ path: "comments.user", select: '-password' });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log(`error in getFollowing ${error}`);
        res.status(500).json({ error: "error in getFollowing" });
    }
};


