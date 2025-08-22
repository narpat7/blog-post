  import React, { useEffect, useRef, useState } from "react";
  import axios from "axios";
  import { useParams, useNavigate } from "react-router-dom";
  import './article.css';
  import { MdDelete, MdEdit } from "react-icons/md";  
  import { FcLike } from "react-icons/fc";

  export default function ShowArticle() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    // const isAuthenticated = localStorage.getItem("authenticated") === "true";   
    const [isAuthenticated, setIsAuthenticated] = useState(false);   
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

      useEffect(() => {
        const checkAuthFromServer = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              setIsAuthenticated(false);
              return;
            }
      
            const res = await fetch("http://localhost:3000/api/owner/verify-token", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
      
            if (res.ok) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (err) {
            setIsAuthenticated(false);
          }
        };
      
        checkAuthFromServer();
      }, []);

    useEffect(() => {
  if (article) {
    setLikes(article.likes || 0);

    const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    setIsLiked(likedArticles.includes(id));
  }
}, [article, id]);

const handleLike = async () => {
  const newIsLiked = !isLiked;
  const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");

  if (newIsLiked) {
    likedArticles.push(id);
  } else {
    const index = likedArticles.indexOf(id);
    if (index !== -1) likedArticles.splice(index, 1);
  }

  localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
  setIsLiked(newIsLiked);

  try {
    const response = await axios.post(`http://localhost:3000/articles/like/${id}`, {
      isLiked: newIsLiked,
    });
    setLikes(response.data.likes);
  } catch (err) {
    console.error("❌ Like API error:", err);
  }
};


    useEffect(() => {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/articles/article/${id}`);
          setArticle(response.data);
        } catch (error) {
          console.error("❌ Error fetching article:", error);
          alert("Failed to load article.");
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }, [id]);

    const handleDelete = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please login.");
    navigate("/login");
    return;
  }

  if (window.confirm("Are you sure you want to delete this article?")) {
    axios
      .delete(`http://localhost:3000/articles/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Secure token header
        },
      })
      .then(() => {
        alert("✅ Article deleted successfully!");
        navigate("/articles");
      })
      .catch((error) => {
        console.error("❌ Error deleting article:", error);
        alert("Failed to delete article.");
      });
  }
};


    return (
      <div className="max-w-7xl mx-auto px-6 py-10 font-roboto">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">⏳ Loading article...</p>
        ) : article ? (
          <div className="bg-[#fff2eb] rounded-xl p-6 shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]">
          <div className="relative w-full">
            <button
              onClick={() => navigate("/articles")}
              className="text-blue-600 text-sm font-medium hover:underline mb-4"
            >
              ← Back to Articles
            </button>
            
      {isAuthenticated && (
        <>
          <span className="absolute right-10 top-0 text-2xl text-blue-500">
            <MdEdit onClick={() => navigate(`/edit/${id}`)} />
          </span>
          <span className="absolute right-0 top-0 text-2xl text-blue-500">
            <MdDelete onClick={handleDelete} />
          </span>
        </>
      )}
      
      {/* </button> */}
          </div>
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-gray-600 text-xl mb-4">{article.category}</p>

            {/* 🔁 Auto + manual scrollable image carousel */}
            <div
              ref={scrollRef}
              className="w-full h-100 overflow-x-auto whitespace-nowrap scroll-smooth bg-[#ffd6ba] rounded-xl flex items-center gap-2"
            >
             
              {article.images && article.images.length > 0 ? (
                article.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/articles/image/${article._id}/${index}`}
                    alt={`Image ${index + 1}`}
                    className="h-full object-cover rounded-lg"
                    style={{ width: "400px", flexShrink: 0 }}
                  />
                ))
              ):( 
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            <div
              className="article-content mt-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <hr className="text-red-800 mb-4"/>
          <div className="flex items-center justify-between">
            {/* Like button and count */}
            <div className="flex items-center gap-3">
              <button onClick={handleLike}>
                <FcLike
                  className="text-3xl"
                  style={{ filter: isLiked ? "none" : "grayscale(100%)" }}
                />
              </button>
              <span className="text-lg mt-1">{likes} likes</span>
            </div>
                      
            {/* Date right aligned */}
            <h1 className="text-sm text-gray-700">
              {new Date(article.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </h1>
          </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No article found.</p>
        )}
            
      </div>
    );
  }
