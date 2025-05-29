import { db } from "../libs/db.js";

export const getAllListDetails=async(req,res)=>{

    try {
        const playlists=await db.playlist.findMany({
            where:{
                userId:req.user.id,
            },
            include:{
                problems:{
                    include:{
                        problem:true,
                    }
                }
            }
        });
        res.status(200).json({
            success:false,
            message:"playlists fetched successfully",
            playlists,
        })
    } catch (error) {
         console.error(error);
        res.status(500).json({
            success:false,
            message:"failed to fetch playlists",
        })
        
    }
}

export const getPlayListDetails= async(req,res)=>{
    const {playlistId}=req.params;
    try {
        const playlist=await db.playlist.findUnique({
            where:{
                id:playlistId,
                userId:req.user.id,
            },
            include:{
                problems:{
                    include:{
                        problem:true,
                    }
                }
            }
        });

        if(!playlist){
            req.status(400).json({
                error:"playlist not found",
            });
        }

        res.status(200).json({
            success:true,
            message:"playlist fetched successfully",
            playlist,
        })
    } catch (error) {
         console.error(error);
        res.status(500).json({
            success:false,
            message:"failed to fetch playlist",
        })
    }

}

export const createPlaylist=async(req,res)=>{
 try {
        const {name,description}=req.body;
        if(!name || !description){
            res.status(400).json({
                success:false,
                message:"all field must be fullfilled",
            })
        }
        const userId=req.user.id;

        if(!userId){
            res.status(400).json({
                success:false,
                message:"user field is not find"
            })
        }

        const playlistFind=await db.Playlist.findUnique({
            where: {
        name_userId: {
          name: name,
          userId: userId
        },
      },
        })

        if(playlistFind){
            req.status(400).json({
                success:false,
                message:"playlist already exist"
            })
        }

        const playlist=await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success:true,
            message:"playlist created successfully"
        })
    } catch (error) {
        
    }
}

export const addProblemToPlaylist=async(req,res)=>{
    const {playlistId}=req.params;
    const {problemIds}=req.body;


    try {
        
        if(!Array.isArray(problemIds) || problemIds.length===0){
            return res.status(400).json({error:"invalid or missing error"});
        }

        //create records for each problems in the playlist 
        const problemInPlaylist=await db.problemInPlaylist.createMany({
            data:problemIds.map((problemId)=>({
                playlistId,
                problemId
            }))
        })
        res.status(201).json({
            success:true,
            message:"Problems added to playlist successfully",
            problemInPlaylist,
        })
    } catch (error) {
          console.error("error adding problem in playlist",error);
        res.status(500).json({
            success:false,
            message:"error adding problem in playlist",
        })
    }

}

export const deletePlaylist=async(req,res)=>{
const {playlistId}=req.params;

try {
    const deletePlaylist=await db.playlist.delete({
        where:{
            id:playlistId
        }
    });
    res.status(200).json({
        success:true,
        message:"playlist deleted successfully",
        deletePlaylist,
    })
} catch (error) {
    console.log('error deleting playlist',error);
    res.status(500).json({
        error:'failed to delete playlist'
    });
}

}

export const removeProblemFromPlaylist=async(req,res)=>{

    const {playlistId}=req.params;
    const {problemIds}=req.body;

    try{
      
        if(!Array.isArray(problemIds)||problemIds.length===0){
            return res.status(400).json({error:"invalid or missing problemId"})
        }

        const deleteProblem=await db.problemsInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds,
                }
            }
        })

        res.status(400).json({
            success:true,
            message:"problem removed from playlist successfully",
            deleteProblem,
        })
    }catch(error){
      console.log("Error removing problem from playlist",error.message);
      res.status(500).json({
        error:'failed to remove problem from playlist'
      });
    }

}