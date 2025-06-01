import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    console.log("📄 Fetching blog by slug:", slug);
    axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${slug}`)
      .then((res) => {
        console.log("✅ Blog loaded:", res.data.data);
        setBlog(res.data.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch blog:", err);
      });
  }, [slug]);

  if (!blog) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="text-sm text-gray-500 mb-6">By {blog.author}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}
