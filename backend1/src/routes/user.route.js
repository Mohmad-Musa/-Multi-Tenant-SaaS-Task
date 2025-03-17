import express, { Router } from "express"
import { checkAuth, GetallOrgByUser, GetUserById, GetUsers, login, logout, signup } from "../Controller/user.controller.js";
import {  ProtectedRoutes } from "../../middleware/ProtectedRoute.js";

const router = express.Router();


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/users", GetUsers);
router.get("/user/:id", GetUserById);
router.get("/allOrg/:id",GetallOrgByUser)
router.get("/check",ProtectedRoutes,checkAuth)




export default router;
