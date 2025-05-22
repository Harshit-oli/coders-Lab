import { db } from "../libs/db.js";

export const getAllSubmission=async (req,res)=>{
  try {
    const userId=req.user.id;

    const submissions=await db.submission.findMany({
        where:{
            userId,
        }
    })
    res.status(200).json({
        success:true,
        message:"submission fetched successfully",
        submissions
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
        success:false,
        message:"internal server error"
    })
  }
}

export const getSubmissionsForProblem=async (req,res)=>{
    try {
        const userId=req.userId;
        const {problemId}=req.params;

        const submissions=await db.submission.findMany({
            where:{
                userId,
            }
        })
        res.status(200).json({
            success:true,
            message:"submission fetched successfully",
            submissions,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

export const getAllTheSubmission=async (req,res)=>{
try {
    const {problemId}=req.params;
const submission=await db.submission.count({
    where:{
        problemId:problemId
    }
})

res.status(200).json({
    success:true,
    message:"submission fetched successfully",
    count:submission,
})
} catch (error) {
    console.error("count",error);
    res.status(500).json({
        success:false,
        message:"internal server error",
    })
}



}