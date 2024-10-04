import express from "express";
import {createProject,deployProject,getAllProjects,changeStatus,getDeploymentsByProjectID,getLogs, getRepos, getProjectById, getBranches, updateProject, updateEnvFields} from '../controllers/project'
import { validateProject } from "../middleware/zodValidators";
import { authenticateToken } from "../middleware/auth";
import { projectSchema } from "../validationSchema/project";

const router = express.Router();
const validateProjectDetails = ()=>{
   return validateProject(projectSchema);
}
router.get("/:userId",authenticateToken,getAllProjects);
router.get("/singleProject/:projectId",authenticateToken,getProjectById);
router.get("/deploy/:projectId",authenticateToken,getDeploymentsByProjectID);

router.post("/",authenticateToken,validateProjectDetails(),createProject);
router.put("/:projectId",authenticateToken,updateProject);
router.put("/env/:projectId",authenticateToken,updateEnvFields);

router.post("/deploy/:projectId",authenticateToken,deployProject);
router.put("/deploy/:deployId",changeStatus);
router.get("/deploy/logs/:deployId",authenticateToken,getLogs);
router.get("/github/repos",authenticateToken,getRepos);
router.get("/github/branches/:projectId",authenticateToken,getBranches);

export default router
