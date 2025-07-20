import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GiCardExchange } from "react-icons/gi";
import axios from "axios";

export default function Profile() {
  const [profileimage, setprofileimage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Load latest image on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:3000/api/owner/profile/latest-image", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.image) {
          setprofileimage(`http://localhost:3000${res.data.image}`);
        }
      })
      .catch((err) => {
        console.error("Image load error", err);
        alert("Failed to load profile image");
      });
  }, []);

  // ✅ Upload new image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/owner/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.imageUrl) {
        setprofileimage(`http://localhost:3000${res.data.imageUrl}`);
        // alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const Logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      alert("✅ Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen font-roboto flex items-center justify-center p-4">
      <div className="bg-[#FFF2EB] shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            {profileimage ? (
              <img src={profileimage} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 bg-white">
                No Image
              </div>
            )}
          </div>

          <GiCardExchange
            onClick={() => fileInputRef.current.click()}
            title="Change Image"
            className="absolute -bottom-2 -right-2 text-3xl text-white bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <h2 className="text-2xl font-bold">Narpat Choudhary</h2>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button onClick={() => navigate("/add")} className="px-4 py-1 border rounded-full text-sm transition bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600">
            Add Article
          </button>
          <button onClick={()=>navigate("/forgot-password")} className="px-4 py-1 border rounded-full text-sm transition bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600">
            ChangePassword
          </button>
          <button className="px-4 py-1 border rounded-full text-sm transition bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600">
            Button 3
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button onClick={Logout} className="px-4 py-1 border rounded-full text-sm transition bg-white text-red-600 hover:bg-red-600 hover:text-white border-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
