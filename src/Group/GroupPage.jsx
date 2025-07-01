import React, { useState } from "react";
import { axiosInstance } from "../axios"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function GroupPage() {
  const [name, setName] = useState("");
const [isPublic, setIsPublic] = useState(true); // default to public
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/create-group", {
        name,
        isPublic,
      });

      toast.success("Group created!");
      navigate("/"); // Redirect to homepage or group chat view
    } catch (error) {
      toast.error("Error creating group");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Group</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          className="input input-bordered w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="label cursor-pointer justify-start gap-2">
        <input
  type="checkbox"
  className="checkbox checkbox-primary"
  checked={isPublic}                     // ✅ Controlled by state
  onChange={(e) => setIsPublic(e.target.checked)}  // ✅ Updates state on toggle
/>

          <span className="label-text">Make this group public</span>
        </label>
        <button type="submit" className="btn btn-primary mt-4">
          Create Group
        </button>
      </form>
    </div>
  );
}

export default GroupPage;
