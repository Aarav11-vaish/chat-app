import { create } from 'zustand';
import { axiosInstance } from './axios.js';
import toast from 'react-hot-toast';
export const authStore = create((set) => ({
    authUser: null,
    isSignedUp: false,
    isLoggedIn: false,
    ischeckAuthenticated: true,
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
        set({ isSignedUp: true });
        try{
            const res =await axiosInstance.post('/signup', data);
            console.log(res);
            set({ authUser: res.data});
            toast.success("Signup successful");
        }
            catch(e){
toast.error("Signup failed");
console.error(e, "Error in signAuth");
            }
        finally {
            set({ isSignedUp: false });
        }
    },
     logout:async()=>{
        try{
            const res =await axiosInstance.get('/logout');
            set({ authUser:null});
            console.log(res);
            toast.success("Logout successful");
        }
        catch(e){
            console.error(e, "Error in logout");
            toast.error("Logout failed");

        }
    }    
}));

