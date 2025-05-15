import express from "express"
import { authMiddleware, checkUser } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";
const problemRoutes= express.Router();

problemRoutes.post("/create-problem",authMiddleware,checkUser,createProblem);
problemRoutes.get("/get-all-problems",authMiddleware,getAllProblems);
problemRoutes.get("/get-problem/:id",authMiddleware,getProblemById);
problemRoutes.put("/update-problem/:id",authMiddleware,checkUser,updateProblem);
problemRoutes.delete("/delete-problem/:id",authMiddleware,checkUser,deleteProblem);
problemRoutes.get("/get-solved-problems",authMiddleware,checkUser,getAllProblemsSolvedByUser);

export default problemRoutes;