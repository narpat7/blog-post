import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loadingImages, setLoadingImages] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  // const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

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
  


  // Auto change image every 10s
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [images]);

//   useEffect(() => {
//   const fetchImages = async () => {
//     try {
//       setLoadingImages(true);
//       const res = await axios.get("http://localhost:3000/api/owner/home/images");

//       const imageArr = await Promise.all(
//         res.data.images.map(async (img) => {
//           const imageRes = await fetch(`http://localhost:3000/api/owner/home-image/${img._id}`);
//           const blob = await imageRes.blob();
//           const imageUrl = URL.createObjectURL(blob);
//           return { url: imageUrl, filename: img._id };
//         })
//       );

//       setImages(imageArr);
//     } catch (err) {
//       console.error("Image load error", err);
//     }
//   };

//   fetchImages();
//   {
//   setLoadingImages(false);
//   }
// }, []);

useEffect(() => {
  const fetchImages = async () => {
    try {
      setLoadingImages(true);
      const res = await axios.get("http://localhost:3000/api/owner/home/images");

      const imageArr = await Promise.all(
        res.data.images.map(async (img) => {
          const imageRes = await fetch(`http://localhost:3000/api/owner/home-image/${img._id}`);
          const blob = await imageRes.blob();
          const imageUrl = URL.createObjectURL(blob);
          return { url: imageUrl, filename: img._id };
        })
      );

      setImages(imageArr);
      setLoadingImages(false); // ✅ move this INSIDE try block after setImages
    } catch (err) {
      console.error("Image load error", err);
      setLoadingImages(false); // ✅ also handle error case
    }
  };

  fetchImages();
}, []);


  // Add image
  const addImage = () => {
    fileInputRef.current?.click();
  };

  // Remove image
  const removeImage = async (index) => {
    const filename = images[index].filename;
    try {
      await axios.delete(`http://localhost:3000/api/owner/home/image/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      if (current >= updated.length && current > 0) setCurrent(current - 1);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles/allarticles");
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sorted.slice(0, 10));
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
        alert("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="mx-auto font-roboto bg-[#fff2eb] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-[90%]">

      {/* 🖼 Image Display */}
      <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden shadow-lg mb-8">
        {/* {images.length > 0 && images[current]?.url ? (
          <img 
            src={images[current].url} 
            alt="Uploaded" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Uploaded
          </div>
        )} */}
        {loadingImages ? (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-lg">
    Loading Image...
  </div>
) : images.length > 0 && images[current]?.url ? (
  <img src={images[current].url} alt="Uploaded" className="w-full h-full object-cover" />
) : (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
    No Image Uploaded
  </div>
)}

      </div>

      {/* ⬤ Dot Indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full cursor-pointer ${i === current ? "bg-black" : "bg-gray-400"}`}
          />
        ))}
      </div>

      {/* ➕➖ Buttons */}
      {isAuthenticated && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={addImage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Image
          </button>

          {images.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to remove this image?")) {
                  removeImage(current);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove Current
            </button>
          )}

          {/* Hidden file input for add image */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("image", file);

              fetch("http://localhost:3000/api/owner/home/image", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              })
                .then((res) => res.json())
                .then((data) => {
                if (data.success && data.id) {
                  fetch(`http://localhost:3000/api/owner/home-image/${data.id}`)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const imageUrl = URL.createObjectURL(blob);
                      setImages((prev) => [
                        ...prev,
                        {
                          url: imageUrl,
                          filename: data.id,
                        },
                      ]);
                      setCurrent(images.length); // show newly uploaded image
                    });
                }
              })

            }}
          />
        </div>
      )}

      {/* Welcome Section */}
      <div className="text-center mt-4">
        <h1 className="text-3xl font-bold text-[#FF6B6B]">Welcome to Our Fitness App</h1>
        <p className="mt-2 text-lg text-gray-700">
          Your journey to a healthier life starts here. Join us and achieve your fitness goals!
        </p>
      </div>

      {/* Articles */}
      <div className="mt-8 bg-[#FFD6BA] p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Latest Articles</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
            {articles.map((article, index) => (
              <div
                key={article._id || index}
                onClick={() => navigate(`/article/${article._id}`)}
                className="min-w-[250px] max-w-[250px] bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer flex-shrink-0"
              >
                <div className="h-36 overflow-hidden rounded-t-lg">
                  {article.images && article.images.length > 0 ? (
                    <img
                      src={`http://localhost:3000/articles/image/${article._id}/0`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-green-600 font-semibold truncate">{article.category}</p>
                  <h2 className="text-md font-bold text-gray-800 line-clamp-2">{article.title}</h2>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-6 text-sm text-gray-600 font-semibold">
          HealthWithChoudhary.com
        </div>
      </div>
    </div>
  );
}
