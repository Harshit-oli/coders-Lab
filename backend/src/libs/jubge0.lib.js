import axios from "axios"
// import dotenv from 'dotenv';
// dotenv.config();

export const getJudge0LanguageId=(language)=>{
 
    const languageMap={
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
        // "CPP":54,
    }
    return languageMap[language.toUpperCase()];
}

const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));

export const pollBatchResults=async (tokens)=>{  //polling karte hai yha par hum
    while(true){
        const {data}=await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false
            }
        })
        const results=data.submissions;
        const isAllDone=results.every(
            (r)=>r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results;
        await sleep(1000)
    }
}
export const submitBatch=async(submissions)=>{
    const {data}=await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch`,{   //{data} ko is tarike se bhejne ka matlab hai ki hum jo response aayega usme se sirf data ko fetch karenge
        submissions,
    })
    console.log("submission result",data);
    return data;  //[{token},{token},{token}]  yha hme array of object milega jiske andar token present honge
}

export function getLanguageName(languageId){
    const LANGUAGE_NAMES={
        74:"TypeScript",
        63:"JavaScript",
        71:"Python",
        62:"Java",
    }
     return LANGUAGE_NAMES[languageId] || "Unknown"
}