import {create} from "zustand"
// create--Tumhara ek global store (state) banana — jise React components kahin se bhi access kar sakein.
import { exiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore =create((set)=>({
    authUser:null,
    isSigninup:false,
    isLoggingIn:false,
    isCheckingAuth:false,

    checkAuth: async ()=>{
        set({isCheckingAuth:true});
        try{
            const res=await exiosInstance.get("/auth/check");
            console.log("checkauth Response",res.data);
             set({authUser:res.data.user});
        }
        catch(error){
          console.log("Error checkin auth",error);
          set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
     set({isSigninup:true});
     try {
         const res=await exiosInstance.post("/auth/register",data);
     set({authUser:res.data.user});
     toast.success(res.data.message);
     } catch (error) {
        console.log("Error signing up",error);
        toast.error("Errorsigning up");
     }
     finally{
        set({isSigninup:false});
     }
    },

     login:async(data)=>{
     set({isLoggingIn:true});
     try {
         const res=await exiosInstance.post("/auth/login",data);
     set({authUser:res.data.user});
     toast.success(res.data.message);
     } catch (error) {
        console.log("Error login up",error);
        toast.error("Errorsigning up");
     }
     finally{
        set({isLoggingIn:false});
     }
    },

    logout:async()=>{
            try {
                await exiosInstance.post("/auth/logout");
                set({authUser:null});
                toast.success("logout successful");
            } catch (error) {
                console.log("error logging out",error);
                toast.error("error logging out");   
            }
    }
}))