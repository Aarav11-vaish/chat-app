import { useState } from "react";
import { useNavigate} from "react-router-dom";
function CreateGroup(){
  const navigate = useNavigate();
 return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">Group Mode Active</h2>
        <p className="text-zinc-500 mb-4">
          Select a group from the sidebar or create a new one.
        </p>
        <button
          onClick={() => navigate("/group-page")}
          className="btn btn-primary"
        >
          + Create New Group
        </button>
      </div>
    );
}
export default CreateGroup;