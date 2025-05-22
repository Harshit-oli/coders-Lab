import { pollBatchResults } from "../libs/jubge0.lib.js";
import { submitBatch } from "../libs/jubge0.lib.js";
import { db } from "../libs/db.js";
import { getLanguageName } from "../libs/jubge0.lib.js";

export const executeCode=async(req,res)=>{
try {
    const {source_code,language_id,stdin,expected_outputs,problemId}=req.body;

    const userId=req.user.id;

    //validate test cases

    if(
        !Array.isArray(stdin) || 
        stdin.length===0 ||
        !Array.isArray(expected_outputs) ||
        expected_outputs.length !== stdin.length
    ){
        return res.status(400).json({error:"Invalid or missing test cases"})
    }

    //2.prepare each test case for judge0 batch submission
    const submissions=stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input,

    }))

    //3. send betch of submissions to judge0
   const submitResponse=await submitBatch(submissions);

   const tokens= submitResponse.map((res)=>res.token);

//    4.poll judge0 for results of all submitted test cases
   const results=await pollBatchResults(tokens);

   console.log('results----------');
   console.log(results);

   //analyse test case result

   let allPassed=true;
   const detailedResult=results.map((result,i)=>{
    const stdout=result.stdout?.trim();
    const expected_output=expected_outputs[i]?.trim();
    const passed=stdout === expected_output;

    if(!passed) allPassed=false;

    return {
        testCase:i+1,
        passed,
        stdout,
        expected:expected_output,
        stderr:result.stderr || null,
        compile_output:result.compile_output || null,
        status:result.status.description,
        memory:result.memory ? `${result.memory} KB` : undefined,
        time:result.time ? `${result.time} s` : undefined,
    }
   })

   console.log(detailedResult); ///here we check the detail results

   //store submission summary 

   const submission=await db.submission.create({
    data:{
        userId,
        problemId,
        language:getLanguageName(language_id),  ////// mera source code pe kaam baaki hai hw diya hai ki 
        surceCode : { [getLanguageName(language_id)]: source_code },  // [getLanguageName(language_id)]-- yha ye [] ka use dynamic key bnane ke liye kiya hai jisse ki vo value get kar paaye function se
        stdin:stdin.join("\n"),
        stdout:JSON.stringify(detailedResult.map((r)=>r.stdout)),
        stderr:detailedResult.some((r)=>r.stderr)
        ? JSON.stringify(detailedResult.map((r)=>r.stderr))
        : null,
        compileOutput:detailedResult.some((r)=>r.compile_output)
        ? JSON.stringify(detailedResult.map((r)=>r.compile_output))
        : null,
        status:allPassed ? "Accepted" : "wrong answer",
         memory:detailedResult.some((r)=>r.memory)
        ? JSON.stringify(detailedResult.map((r)=>r.memory))
        : null,
        time: detailedResult.some((r)=>r.time)
        ? JSON.stringify(detailedResult.map((r)=>r.time))
        : null,
    }
   });
   //if All passed = true mark problem as solved for their current user

   if(allPassed){
    await db.problemSolved.upsert({
        where:{
            userId_problemId:{
                userId,problemId
            }
        },
        update:{},
        create:{
            userId,problemId
        }
    })
   }

//    8. save individual test case results using detailedResult

 const testCaseResults=detailedResult.map((result)=>({
    submissionId:submission.id,
     testCase:result.testCase,
     passed:result.passed,
     stdout:result.stdout,
     expected:result.expected,
     stderr:result.stderr,
     compileOutput:result.compile_output,
     status:result.status,
     memory:result.memory,
     time:result.time,
 }))

 await db.testCaseResult.createMany({
    data:testCaseResults,
 })

 const submissionWithTestCase = await db.submission.findUnique({
    where:{
        id:submission.id,
    },
    include:{
      testCases:true,
    }
 })
   res.status(200).json({
    success:true,
    message:"code executed!",
    submission:submissionWithTestCase,
   })
} catch (error) {
    console.log(error);
    res.status(500).json({
        message:"not found"
    })
}
}