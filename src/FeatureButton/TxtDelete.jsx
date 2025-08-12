import React from "react";
import { chatStore } from "../chatStore";

function TxtDelete({ onDelete }) {
  return (
    <button
      onClick={onDelete}
      className="px-1 py-1 text-xs font-small text-white rounded-lg shadow hover:bg-red-600 transition-colors"
    >
      Delete 
    </button>
  );
}

export default TxtDelete;
