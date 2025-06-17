import bcrypt from "bcryptjs"
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register=async (req,res)=>{

    const {email,password,name}=req.body;

    if(!email || !password || !name){
        res.status(400).json({
            success:false,
            message:"all fields are required",
        })
    }
    try {
        const findUser= await db.user.findUnique({
            where:{
                email
            }
        })

        if(findUser){
            res.status(400).json({
              error:"user already exist",
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }
        })

        const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !=="development",
            maxAge:7*24*60*60
        })

        res.status(201).json({
            message:"user Created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }
        })

    } catch (error) {
        console.error("error creating user",error);

        res.status(500).json({
            message:"interval server error",
            success:false,
        })
        
    }
}

export const login=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"all fields are required",
    });
  }

  try {
      const user=await db.user.findUnique({
        where:{
            email
        }
      })

      if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not found",
        })
      }
     const comparePassword=bcrypt.compare(password,user.password);
     if(!comparePassword){
        return res.status(400).json({
            success:false,
            message:"invalid credentials",
        })
     }

     const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{
        expiresIn:"7d",
     })

     res.cookie("jwt",token,{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development",
        maxAge:7*24*60*60
    })

    res.status(201).json({
        message:"user logged in successfully",
        user:{
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role,
            image:user.image
        }
    })


  } catch (error) {
    console.error("error creating user",error);

    res.status(500).json({
        message:"interval server error",
        success:false,
    })

  }
}

export const logout=async (req,res)=>{
 try {
    res.clearCookie("jwt",{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
      })
    
      res.status(200).json({
        success:true,
        message:"User logged out successfully",
      })
 } catch (error) {
    console.error("error creating user",error);

    res.status(500).json({
        message:"interval server error",
        success:false,
    })
 }
}

export const check=async (req,res)=>{
  try {
    return res.status(200).json({
        success:true,
        message:"user authenticated successfully",
        user:req.user,
    })
  } catch (error) {
    console.log("Error authenticating user",error);
    res.status(500).json({
        message:"internal server error",
    })
  }
}
