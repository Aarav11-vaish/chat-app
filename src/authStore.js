import { create } from 'zustand';
import { axiosInstance } from './axios'
export const authStore = create((set) => ({
    authUser: null,
    isSignedUp: false,
    isLoggedIn: false,

    ischeckAuthenticated: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/checkAuth')
            // const res =await fetch('http://localhost:5000/checkAuth');
            set({ authUser: res.data });
            console.log(res);


        }
        catch (err) {
            console.error(err, "Error in checkAuth");
            set({ authUser: null });
        }
        finally {
            set({ ischeckAuthenticated: false });
        }
    },
    signAuth:async (data)=>{
        

    }
}));

