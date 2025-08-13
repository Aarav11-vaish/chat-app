import { chatStore } from "../chatStore";
import toast from "react-hot-toast";
const TxtDelete = () => {
  const { messages, deletemessages } = chatStore();

  const handleDelete = () => {
    if (messages.length === 0) {
      toast.error("No messages to delete");
      return;
    }

    if (window.confirm("Delete this conversation?")) {
      console.log(messages);
      
      const firstMessageId = messages[0]._id;
      console.log("Deleting messages with ID:", firstMessageId);
      
      deletemessages(firstMessageId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      title="Delete all messages"
      className="btn btn-xs btn-outline text-red-500"
    >
      🗑
    </button>
  );
};

export default TxtDelete;
