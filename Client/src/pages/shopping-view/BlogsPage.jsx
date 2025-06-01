import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log("📄 Fetching public blogs...");
    axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then((res) => {
        console.log("✅ Blogs fetched:", res.data.data);
        setBlogs(res.data.data || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching blogs:", err);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Our Blog</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blogs/${blog.slug}`}
            className="border rounded overflow-hidden hover:shadow transition bg-white"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4 space-y-1">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500">{blog.summary}</p>
              <p className="text-xs text-gray-400">By {blog.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
