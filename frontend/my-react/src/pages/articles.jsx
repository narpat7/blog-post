import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ShowArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles/allarticles");
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sorted);
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
        alert("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredArticles =
    selectedCategories.length === 0
      ? articles
      : articles.filter((article) =>
          selectedCategories.includes(article.category?.toLowerCase())
        );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-roboto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        All Health & Fitness Articles
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Expert insights on workouts, nutrition, mental wellness, and more.
      </p>

      {/* Category Filter Buttons */}
      {/* <div className="flex gap-4 flex-wrap mb-8">
        {["fat loss","muscle gain", "yoga"].map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-1 border rounded-full text-sm transition ${
              selectedCategories.includes(cat)
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div> */}

      {loading ? (
        <p className="text-center text-gray-500 text-lg">⏳ Loading articles...</p>
      ) : filteredArticles.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No articles found.</p>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 rounded-xl bg-[#fff2eb] shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]">
          {filteredArticles.map((article, index) => {
            const images = article.images || [];
            // const imageSrc =
              // images.length > 0 ? `http://localhost:3000${images[0]}` : null;
              const imageSrc = images.length > 0 ? `http://localhost:3000/articles/image/${article._id}/0` : null;


            return (
              <div
                key={article._id || index}
                onClick={() => navigate(`/article/${article._id}`)}
                className="bg-white rounded-xl shadow-md transition-shadow duration-300 flex flex-col hover:shadow-[0_0_10px_4px_rgba(59,130,246,0.5)] cursor-pointer"
              >
                <div className="w-full h-40 bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={article.title}
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <p className="text-xs text-green-600 font-medium uppercase mb-1 truncate">
                    {article.category}
                  </p>
                  <h2 className="text-md font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <div
                    className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  <button className="mt-auto text-blue-600 text-sm font-medium hover:underline">
                    Read more →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
