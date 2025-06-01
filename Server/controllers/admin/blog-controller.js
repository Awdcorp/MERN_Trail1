const Blog = require("../../models/Blog");

// ✅ Create Blog
const createBlog = async (req, res) => {
  try {
    console.log("📥 Creating blog with data:", req.body);
    const blog = new Blog(req.body);
    await blog.save();
    console.log("✅ Blog created:", blog._id);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("❌ Blog create error:", err);
    res.status(500).json({ success: false, message: "Failed to create blog" });
  }
};

// ✅ Update Blog
const updateBlog = async (req, res) => {
  try {
    console.log("✏️ Updating blog:", req.params.id, "with data:", req.body);
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      console.warn("⚠️ Blog not found for update:", req.params.id);
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    console.log("✅ Blog updated:", blog._id);
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("❌ Blog update error:", err);
    res.status(500).json({ success: false, message: "Failed to update blog" });
  }
};

// ✅ Delete Blog
const deleteBlog = async (req, res) => {
  try {
    console.log("🗑 Deleting blog:", req.params.id);
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      console.warn("⚠️ Blog not found for deletion:", req.params.id);
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    console.log("✅ Blog deleted:", blog._id);
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    console.error("❌ Blog delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
};

// ✅ Get All Blogs (admin)
const getAllBlogs = async (req, res) => {
  try {
    console.log("📄 Fetching all blogs (admin)");
    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log("✅ Blogs fetched:", blogs.length);
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("❌ Fetch blogs error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

// ✅ Get Blog by Slug (public view)
const getBlogBySlug = async (req, res) => {
  try {
    console.log("🔍 Fetching blog by slug:", req.params.slug);
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog || blog.status !== "published") {
      console.warn("⚠️ Blog not found or unpublished:", req.params.slug);
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    console.log("✅ Blog found by slug:", blog._id);
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("❌ Fetch blog by slug error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch blog" });
  }
};

// ✅ Get all blogs (public view)
const getPublicBlogs = async (req, res) => {
  console.log("📄 Fetching public blogs...");
  try {
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
    console.log("✅ Public blogs fetched:", blogs.length);
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("❌ Failed to fetch public blogs:", err);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

// ✅ Get Blog by ID (admin view/edit)
const getBlogById = async (req, res) => {
  try {
    console.log("🔎 Fetching blog by ID:", req.params.id);
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.warn("⚠️ Blog not found by ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    console.log("✅ Blog fetched by ID:", blog._id);
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("❌ Fetch blog by ID error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch blog" });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  getPublicBlogs,
};
