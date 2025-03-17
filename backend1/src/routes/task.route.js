import express from "express"
import { CreateTask, DeleteTask, getTaskById, UpdateTask, ViewAllTaskForOrg, ViewAllTaskForUser } from "../Controller/task.controller.js";
import { ProtectedRoutes } from "../../middleware/ProtectedRoute.js";


const router = express.Router();

router.post("/create",ProtectedRoutes,CreateTask)
router.get("/viewAllTasks/:OrgId", ViewAllTaskForOrg);
router.get("/viewAllTasksForUser/:UserId", ViewAllTaskForUser);
router.delete("/deleteTask/:TaskId",ProtectedRoutes, DeleteTask);
router.get("/viewTask/:TaskId", getTaskById);
router.put("/updateTask/:TaskId",ProtectedRoutes, UpdateTask);
export default router;