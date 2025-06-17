import axios from "axios"

export const exiosInstance=axios.create({  // create ka kaam yha ye hota hai hme baar baar axios.get,axios.post ke liye alag se ye sab nhi bnana padta hum seedhe jis file ke andar axios.create kiya hai uske baad .get,.post lga sakte hai jisse ki dry principle evaluate nhi hota hai
    baseURL:import.meta.env.MODE === "development" ? "http://localhost:8000/api/v1" : "/api/v1",
    withCredentials: true,
})