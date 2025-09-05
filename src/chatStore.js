import { create } from 'zustand';
import axios from 'axios';
import { axiosInstance } from './axios';
import toast from 'react-hot-toast';
import { authStore } from './authStore';
export const chatStore = create((set, get) => ({
    messages: [],
    groupMessages: [],
    users: [],
    selectedusers: null,
    isuserloading: false,
    ismessagesloading: false,
    chatMode: 'personal',
    groups: [],
    isGroupLoading: false,
    selectedGroups: null,
    
joinGroup: async (group) => {
  try {
    const res = await axiosInstance.post(`/join-room/${group.roomid}`);
    toast.success(res.data.message || "Joined or requested group");
    get().getGroups();
  } catch (e) {
    toast.error(e?.response?.data?.error || "Error joining group");
    console.error("Join error:", e);
  }
  
},

    setChatMode: (mode) => set({ chatMode: mode }),
    setSelectedGroups: (selectedGroups) => set({ selectedGroups }),

   getGroupMessages: async (groupId) => {
//   set({ ismessagesloading: true, messages: [] }); // clear old messages
  try {
    const res = await axiosInstance.get(`/group-messages/${groupId}`);
    set({ messages: res.data });
  } catch (e) {
    toast.error("Error in fetching group messages");
    console.error(e);
  } finally {
    set({ ismessagesloading: false });
  }
},



    getGroups: async () => {
        set({ isGroupLoading: true });
        try {
            const res = await axiosInstance.get('/all-groups');
            set({ groups: res.data });
        }
        catch (e) {
            toast.error("Error in fetching groups");
            console.error(e);
        }
        finally {
            set({ isGroupLoading: false });
        }
    },

    getUsers: async () => {
        set({ isuserloading: true });
        try {
            const res = await axiosInstance.get('/users');
            set({ users: res.data });

        }
        catch (e) {
            console.error(e);
        }
        finally {
            set({ isuserloading: false });
        }

    },
deletemessages: async (messageid)=>{
try{

    if (!messageid) {
        toast.error("No message ID provided");
        return;
    }else{
        console.log("Deleting messages with ID:", messageid);
    }
    console.log(axiosInstance, `/messages/${messageid}/delete`);
    
    const res = await axiosInstance.delete(`/messages/${messageid}/delete`);
    console.log("Delete response:", res.data);
    
    toast.success(res.data.message || "Messages deleted successfully"); // ✅ Fixed
    set({messages:[]});
}
catch(e){
    toast.error("Error in deleting messages");
    console.error(e);
}
},

    getMessages: async (id) => {
        set({ ismessagesloading: true });
        try {
            const res = await axiosInstance.get(`/${id}`);
            set({ messages: res.data });

        }
        catch (e) {
            toast.error("Error in fetching messages");
            console.error(e);
        }
        finally {
            set({ ismessagesloading: false });
        }
    },
    sendMessages: async (receiverid, text, image) => {
  try {
    const { chatMode } = get();
    const url =
      chatMode === "group"
        ? `/group-messages/${receiverid}`
        : `/send/${receiverid}`;

    const res = await axiosInstance.post(url, { text, image });

    set((state) => ({
      messages: [...state.messages, res.data],
    }));
  } catch (e) {
    toast.error("Error in sending message");
    console.error(e);
  }
},

    setSelectedUser: (selectedusers) => set({ selectedusers }),

subscribetomessages: () => {
    const { selectedusers } = get();
    const socket = authStore.getState().socket;

    if (!socket) return;

    socket.on("newmessage", (newmessage) => {
        if (
            newmessage.senderID !== selectedusers._id &&
            newmessage.receiverID !== selectedusers._id
        ) return;
        set({ messages: [...get().messages, newmessage] });
    });

    socket.on("conversationDeleted", ({ sender, receiver }) => {
        const { selectedusers } = get();
        if (
            selectedusers &&
            [sender, receiver].includes(selectedusers._id)
        ) {
            set({ messages: [] });
        }
    });
},

    unsubscribetomessages: () => {
        const socket = authStore.getState().socket;
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }
        socket.off("newmessage");
    }


}));