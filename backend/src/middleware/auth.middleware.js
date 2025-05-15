import jwt from "jsonwebtoken"
import { db } from "../libs/db.js";
export const authMiddleware=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt;

    if(!token){
     res.status(400).json({
         success:false,
         message:"token not found",
     })
    }
    let decode;
 
    try {
     decode=jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
     return res.status(400).json({
         message:"Unauthorised-Invalid token",
     })
    }
 
    const user=await db.user.findUnique({
     where:{
         id:decode.id
     },
     select:{
         id:true,
         image:true,
         name:true,
         email:true,
         role:true
     }
    })
 
    if(!user){
     return res.status(400).json({
         message:"user not found",
     });
    }
 
    req.user=user;
    next();
  } catch (error) {
    console.log("Error authenticating user",error);
    res.status(500).json({
        message:"internal server error",
    })
  }
}

export const checkUser=async(req,res,next)=>{    //role base access-R back hota hai
  try {
    const userId=req.user.id;

    const user = await db.user.findUnique({
      where:{
          id:userId,
      },
      select:{
          role:true,
      }
  })
  if(!user || user.role!=="ADMIN"){
    return res.status(403).json({
      message:"Access denied - Admin only"
    })
  }
 next();
  } catch (error) {
    console.log("error checking admin role",error);
    res.status(500).json({
      success:false,
      message:"error checking admin role",
    })
  }
}