import { create } from "zustand";
import { exiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore=create((set)=>({
    isLoading:null,
    submissions:[],
    submission:null,
    submissionCount:null,

    getAllSubmissions:async()=>{
        try {
            set({isLoading:true})
            const res=await exiosInstance.get("/submission/get-all-submissions");
            set({submissions:res.data.submissions})
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error getting all submission",error);
            toast.error("Error getting all submissions");  
        }
        finally{
            set({isLoading:true});
        }
    },

    getSubmissionForProblem: async (problemId)=>{
        try{
            const res=await exiosInstance.get(`/submission/get-submission/${problemId}`);
            set({submission:res.data.submissions});
        }
        catch(error){
            console.log("Error getting submission for problem",error);
            toast.error("Error getting submissions for problem");

        }
    },

    getSubmissionCountForProblem:async(problemId)=>{
        try {
            const res=await exiosInstance.get(`/submission/get-submission-count/${problemId}`);
            set({submissionCount:res.data.count});
        } catch (error) {
            console.log("Error getting submission count for problem",error);
            toast.error(`Error getting submission count for problem`);   
        }
    }

}))