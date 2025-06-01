import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then((res) => setBlogs(res.data.data || []))
      .catch((err) => console.error("❌ Error fetching blogs:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold mb-3">Our Blog</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore stories, ideas, and updates from the world of parties, fun, and celebrations.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => {
          const formattedDate = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : "";

          return (
            <Link
              key={blog._id}
              to={`/shop/blogs/${blog.slug}`}
              className="bg-white group rounded-2xl overflow-hidden shadow-md hover:shadow-xl border transition-all flex flex-col"
            >
              {/* Blog Image */}
              {blog.image && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-semibold leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h2>

                {blog.summary && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.summary}
                  </p>
                )}

                <div className="text-xs text-gray-400 mt-auto pt-3">
                  <p className="font-medium text-gray-700">By {blog.author}</p>
                  <p>{formattedDate}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
