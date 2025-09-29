import {create} from "zustand"
import { exiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useActions=create((set)=>({
    isDeletingProblem:false,

    onDeleteProblem:async(id)=>{
        try {
            set({isDeletingProblem:true});
            const res=await exiosInstance.delete(`/problems/delete-problem/${id}`);
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error deleting problem",error);
            toast.error("Error deleting problem");
        }
    }
}))