// controllers/comment.controller.js
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { isCommentInappropriate } from "../utils/moderateComment.js";

export const badComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account is blocked due to repeated violations." });
    }

    const flagged = isCommentInappropriate(text);

    if (flagged) {
      user.warnings += 1;

      if (user.warnings >= 4) {
        user.isBlocked = true;
        await user.save();
        return res.status(403).json({ error: "Your account has been blocked after 3 warnings." });
      }

      await user.save();
      return res.status(200).json({
        warning: `Warning ${user.warnings}/3: Inappropriate comment detected.`,
      });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(200).json({ message: "Comment posted successfully." });

  } catch (err) {
    console.error("Bad Comment Error:", err);
    res.status(500).json({ error: "Server error while posting comment." });
  }
};
