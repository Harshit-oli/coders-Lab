import { db } from "../libs/db.js";
import { pollBatchResults } from "../libs/jubge0.lib.js";
import { submitBatch } from "../libs/jubge0.lib.js";
import { getJudge0LanguageId } from "../libs/jubge0.lib.js";
export const createProblem=async(req,res)=>{
    //
    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions}=req.body;
    //going to check the user role once again

    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({error:"You are not allowed to create a problem"});
    }

    //loop through each reference solution for different languages.
    
        try {
            for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                const languageId=getJudge0LanguageId(language);

                if(!languageId){
                    return res.status(400).json({error:`language ${language} is not supported`})
                }

                const submissions=testcases.map(({input,output})=>({   ///yha par humne test cases bnaye hai jha par hmne test cases ko map kraya hai jisse ki hmara nya 
                    // array create hoga or uske andar hum values ko as a object rakhege

                    source_code:solutionCode,
                    language_id:languageId,
                    stdin:input,
                    expected_output:output,
                }));

                const submissionResult=await submitBatch(submissions);

                const tokens=submissionResult.map((res)=>res.token);  //extract tokens from response

                const results=await pollBatchResults(tokens);

                for(let i=0;i<results.length;i++){
                    const result=results[i];
                    console.log("Result",result);
                    // console.log(`testcase ${i+1} and language ${language} ====result ${JSON.stringify(result.status.description)}`);
                    if(result.status.id !== 3){
                        return res.status(400).json({
                            error:`Testcase ${i+1} failed for language ${language}`
                        })
                    }
                }
                //save the problem to the database
                const newProblem=await db.problem.create({
                    data:{
                        title,
                        description,
                        difficulty,
                        tags,
                        examples,
                        constraints,
                        testcases,
                        codeSnippets,
                        referenceSolutions,
                        userId:req.user.id,
                    }
                })

             return res.status(201).json({
                sucess: true,
                message: "Message Created Successfully",
                problem: newProblem,
             });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success:false,
                message:"internal server error",
            })
        }

};

export const getAllProblems=async(req,res)=>{
  try {
    const problems=await db.Problem.findMany();

    if(!problems){
        return res.status(400).json({
            success:false,
            message:"No problems found",
        })
    }
   
    res.status(200).json({
        success:true,
        message:"Message fetched successfully",
        problems,
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"error while fetching problems",
       
    })
  }
};

export const getProblemById=async(req,res)=>{
    const {id}=req.params;
    try {
        const problem=await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problem){
            return res.status(400).json({
                success:false,
                message:"problem not found",
            })
        }

        res.status(200).json({
            success:true,
            message:"message created successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"error while fetching problem by id",
        })
    }

};

export const updateProblem=async(req,res)=>{
    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions}=req.body;
    const {id}=req.params;
    const id1=req.user.id;
    //going to check the user role once again

    try {
        if(req.user.role !== 'ADMIN'){
            return res.status(403).json({error:"You are not allowed to create a problem"});
        }
    
        const userProblems=await db.problem.findMany({
            where:{
                userId:id1,
            }
        })
    
        if(!userProblems){
            return res.status(400).json({
               success:false,
               message:"you never created any problem",
            })
        }
    //find problem exist or not
    const existProblem=await db.problem.findUnique({
        where:{
            id
        }
    })

    if(!existProblem){
        return res.status(400).json({
           success:false,
           message:"you never created any problem",
        })
    }

        
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId=getJudge0LanguageId(language);

            if(!languageId){
                return res.status(400).json({error:`language ${language} is not supported`})
            }

            const submissions=testcases.map(({input,output})=>({   ///yha par humne test cases bnaye hai jha par hmne test cases ko map kraya hai jisse ki hmara nya 
                // array create hoga or uske andar hum values ko as a object rakhege

                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }));

            const submissionResult=await submitBatch(submissions);

            const tokens=submissionResult.map((res)=>res.token);  //extract tokens from response

            const results=await pollBatchResults(tokens);

            for(let i=0;i<results.length;i++){
                const result=results[i];
                console.log("Result",result);
                // console.log(`testcase ${i+1} and language ${language} ====result ${JSON.stringify(result.status.description)}`);
                if(result.status.id !== 3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }
            const updateProblem=await db.problem.update({
                where:{
                    id
                },
                data:{
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippets,
                    referenceSolutions,
                    userId:req.user.id,
                }
        
            })

         return res.status(201).json({
            sucess: true,
            message: "Message Created Successfully",
            problem:updateProblem,
         });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"updation not success",
        })  
    }

}

export const deleteProblem=async(req,res)=>{
    const {id}=req.params;

    try {
        const problem=await db.problem.findUnique({
            where:{
                id
            }
        })
        if(!problem){
            return res.status(400).json({
                success:false,
            message:"problem not found",
            })
        }

        await db.problem.delete({where:{id}});

        res.status(200).json({
            success:false,
            message:"problem deleted successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
    
}

export const getAllProblemsSolvedByUser=async(req,res)=>{
    try {
        const problems=await db.problem.findMany({
            where:{
                solvedBy:{
                    some:{
                        userId:req.user.id
                    }
                }
            },
            include:{
                solvedBy:{
                    where:{
                        userId:req.user.id
                    }
                }
            }
        })
        res.status(200).json({
            success:true,
            message:"problrm fetched successfully"
        })
    } catch (error) {
        console.log("Error fetched problems :",error);
        res.status(500).json({
            error:"failed to fetch problems",
        })
        
    }
}

