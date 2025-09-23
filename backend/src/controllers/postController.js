const Post = require("../models/Post");

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content, author: req.user.id });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all posts with pagination, sorting, filtering
exports.getPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = "createdAt", author } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = author ? { author } : {};
    const totalCount = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("author", "name email role")
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ data: posts, page, totalCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
