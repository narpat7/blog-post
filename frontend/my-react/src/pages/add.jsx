import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function FitnessContentEditor() {
  const navigate = useNavigate();
  const navigator = useContext(NavigationContext).navigator;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isDirty =
    !submitting &&
    (title.trim() || category.trim() || content.trim() || imageFiles.length > 0);

    
  // ✅ Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      navigate("/login");
    }
  }, []);

  // 🔄 Warn on browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 🔄 Warn on router navigation (like back)
  useEffect(() => {
    if (!isDirty) return;

    const push = navigator.push;
    const replace = navigator.replace;

    const confirmAndNavigate = (method, ...args) => {
      const ok = window.confirm("⚠️ Are you sure you want to leave? Unsaved changes will be lost.");
      if (ok) {
        navigator.push = push;
        navigator.replace = replace;
        method(...args);
      }
    };

    navigator.push = (...args) => confirmAndNavigate(push, ...args);
    navigator.replace = (...args) => confirmAndNavigate(replace, ...args);

    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [navigator, isDirty]);

  const quillModules = {
    toolbar: { container: "#custom-toolbar" },
  };

  // const handleSubmit = async () => {
  //   if (!title.trim() || !category.trim() || !content.trim()) {
  //     alert("❗ Please fill in all required fields."); 
  //     return;
  //   }

  const handleSubmit = async () => {
  if (!title.trim() || !category.trim() || !content.trim()) {
    alert("❗ Please fill in all required fields.");
    return;
  }

  const token = localStorage.getItem("token"); // ✅ Declare token here
  if (!token) {
    alert("No token found. Please login.");
    navigate("/login");
    return;
  }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category.trim());
    formData.append("content", content.trim());

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setSubmitting(true);
      await axios.post("http://localhost:3000/articles/add", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
         },
      });
      alert("✅ Article submitted successfully!");
      setTitle("");
      setCategory("");
      setImageFiles([]);
      setContent("");
      navigate("/articles");
  //   } catch (err) {
  //     console.error("❌ Submission error:", err);
  //     alert("Something went wrong!");
  //   } finally {
  //     setSubmitting(false);
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🏋️‍♀️ Add Fitness Article</h1>

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
          {imageFiles.length === 0 && (
            <label className="flex items-center justify-center h-24 w-28 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-white">
              <div className="text-gray-500 text-center">
                <span className="text-3xl">🖼️</span>
                <p className="text-xs">Upload</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="hidden"
              />
            </label>
          )}

          {imageFiles.map((file, idx) => (
            <div key={idx} className="relative h-24 w-28">
              <button
                onClick={() =>
                  setImageFiles((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm z-10"
              >
                ×
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="h-full w-full object-cover rounded border cursor-pointer"
                onClick={() => document.getElementById(`replace-image-${idx}`).click()}
              />
              <input
                id={`replace-image-${idx}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const newFile = e.target.files[0];
                  if (newFile) {
                    setImageFiles((prev) => {
                      const updated = [...prev];
                      updated[idx] = newFile;
                      return updated;
                    });
                  }
                }}
              />
            </div>
          ))}

          {imageFiles.length > 0 && (
            <label className="flex items-center justify-center h-24 w-28 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-white">
              <div className="text-gray-500 text-center">
                <span className="text-3xl">➕</span>
                <p className="text-xs">Add more</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles((prev) => [...prev, ...Array.from(e.target.files)])
                }
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="border rounded ">
          <div className="ql-container ql-snow" style={{ height: "300px", overflowY: "auto" }}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="h-full"
            />
          </div>

          <div id="custom-toolbar" className="p-2 bg-gray-100 border-t flex flex-wrap gap-1">
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

        <select className="ql-align" defaultValue="">
          <option value=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>

        <select className="ql-font" defaultValue="sans-serif">
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
                    
        <button className="ql-code-block"></button>
        <button className="ql-blockquote"></button>
        <button className="ql-video"></button>

          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🚀 Submit Article
        </button>
      </div>
    </div>
  );
}
