import { create } from 'zustand';
import axios from 'axios';
import { axiosInstance } from './axios';
import toast from 'react-hot-toast';
export const chatStore = create((set, get) => ({
    messages: [],
    users: [],
selectedusers:null,
    isuserloading: false    ,
    ismessagesloading: false,

    getUsers: async () => {
        set({ isuserloading: true });
        try {
            const res = await axiosInstance.get('/users');
            set({ users: res.data });

        }
        catch (e) {
            toast.error("Error in fetching users");
            console.error(e);
        }
        finally {
            set({ isuserloading: false });
        }

    }, 
    getMessages : async (id)=>{
        set({ismessagesloading: true});
        try{
const res =await axiosInstance.get(`/${id}`);
set({messages:res.data});

        }
        catch(e){
            toast.error("Error in fetching messages");
            console.error(e);
        }
        finally{
            set({ismessagesloading: false});
        }
    }, 
 setSelectedUser: (selectedusers) => set({ selectedusers }),



    

}));