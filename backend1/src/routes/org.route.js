import express, { Router } from "express";
import { AddMember, NewOrg, OrgDetails, RemoveMemberFromOrg } from "../Controller/org.controller.js";
import { ProtectedRoutes } from "../../middleware/ProtectedRoute.js";

const router = express.Router();

router.post("/createOrg", ProtectedRoutes,NewOrg);
router.post("/addMember/:id",ProtectedRoutes,AddMember)
router.delete("/delete/:id", ProtectedRoutes, RemoveMemberFromOrg);
router.get("/orgDetails/:id",OrgDetails)

export default router;
