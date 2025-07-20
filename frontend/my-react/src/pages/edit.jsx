import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditFitnessArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
    
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const quillModules = {
    toolbar: {
      container: "#custom-toolbar",
    },
  };

useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/articles/article/${id}`);
        setTitle(res.data.title);
        setCategory(res.data.category);
        setContent(res.data.content);
        setExistingImages(res.data.images || []);
    //   } catch (err) {
    //     console.error("❌ Error loading article:", err);
    //     alert("Failed to load article.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
      } catch (err) {
      console.error("❌ Submission error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setSubmitting(false);
    }
  };
    fetchArticle();
  }, [id]);

  // const handleSubmit = async () => {
  //   if (!title.trim() || !category.trim() || !content.trim()) {
  //     alert("❗ Please fill in all required fields.");
  //     return;
  //   }

  //   const handleSubmit = async () => {
  // if (!title.trim() || !category.trim() || !content.trim()) {
  //   alert("❗ Please fill in all required fields.");
  //   return;
  // }

  // const token = localStorage.getItem("token"); // ✅ Declare token here
  // if (!token) {
  //   alert("No token found. Please login.");
  //   navigate("/login");
  //   return;
  // }

  //   const formData = new FormData();
  //   formData.append("title", title.trim());
  //   formData.append("category", category.trim());
  //   formData.append("content", content.trim());
  //   formData.append("deletedImages", JSON.stringify(deletedImages));
  //   newImageFiles.forEach((file) => {
  //     formData.append("images", file);
  //   });

  //   try {
  //     setSubmitting(true);
  //     await axios.put(`http://localhost:3000/articles/article/edit/${id}`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     alert("✅ Article updated successfully!");
  //     navigate(`/article/${id}`);
  //   } catch (err) {
  //     console.error("❌ Update error:", err);
  //     alert("Something went wrong!");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
  if (!title.trim() || !category.trim() || !content.trim()) {
    alert("❗ Please fill in all required fields.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please login.");
    navigate("/login");
    return;
  }

  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("category", category.trim());
  formData.append("content", content.trim());
  formData.append("deletedImages", JSON.stringify(deletedImages));
  newImageFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    setSubmitting(true);
    await axios.put(`http://localhost:3000/articles/article/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ THIS LINE FIXES THE 403 ERROR
      },
    });
    alert("✅ Article updated successfully!");
    navigate(`/article/${id}`);
  } catch (err) {
    console.error("❌ Update error:", err);
    alert("Something went wrong!");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitting && (title || category || content || newImageFiles.length > 0 || deletedImages.length > 0)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, category, content, newImageFiles, deletedImages, submitting]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">✏️ Edit Fitness Article</h1>

      <div className="space-y-4 bg-[#fff2eb] p-6 rounded shadow">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex overflow-x-auto space-x-3 mt-2 p-2 border rounded bg-gray-100">
          {existingImages.map((img, idx) => (
            <div key={idx} className="relative h-24 w-28">
              <button
                onClick={() => {
                  setDeletedImages((prev) => [...prev, img]);
                  setExistingImages((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm z-10"
              >
                ×
              </button>
              <img
                src={`http://localhost:3000${img}`}
                alt={`existing-${idx}`}
                className="h-full w-full object-cover rounded border"
              />
            </div>
          ))}

          {newImageFiles.map((file, idx) => (
            <div key={idx} className="relative h-24 w-28">
              <button
                onClick={() =>
                  setNewImageFiles((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm z-10"
              >
                ×
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="h-full w-full object-cover rounded border"
              />
            </div>
          ))}

          <label className="flex items-center justify-center h-24 w-28 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-white">
            <div className="text-gray-500 text-center">
              <span className="text-3xl">➕</span>
              <p className="text-xs">Add</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setNewImageFiles((prev) => [...prev, ...Array.from(e.target.files)])
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Rich Text Editor with Toolbar */}
        <div className="border rounded">
          <div className="ql-container ql-snow" style={{ height: "300px", overflowY: "auto" }}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="h-full"
            />
          </div>

          <div
            id="custom-toolbar"
            className="p-2 bg-gray-100 border-t flex flex-wrap gap-1"
          >
            <select className="ql-header" defaultValue="">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="" />
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-link" />
            <button className="ql-image" />
            <select className="ql-color" />
            <select className="ql-background" />
            <button className="ql-clean" />

                        <select class="ql-align">
  <option selected></option>
  <option value="center"></option>
  <option value="right"></option>
  <option value="justify"></option>
</select>
<select class="ql-font">
  <option value="sans-serif" selected>Sans Serif</option>
  <option value="serif">Serif</option>
  <option value="monospace">Monospace</option>
</select>
<button class="ql-code-block"></button>
<button class="ql-blockquote"></button>
<button class="ql-video"></button>

          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "⏳ Updating..." : "💾 Update Article"}
        </button>
      </div>
    </div>
  );
}
