"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = require("../controllers/project");
const zodValidators_1 = require("../middleware/zodValidators");
const auth_1 = require("../middleware/auth");
const project_2 = require("../validationSchema/project");
const router = express_1.default.Router();
const validateProjectDetails = () => {
    return (0, zodValidators_1.validateProject)(project_2.projectSchema);
};
router.get("/:userId", auth_1.authenticateToken, project_1.getAllProjects);
router.get("/singleProject/:projectId", auth_1.authenticateToken, project_1.getProjectById);
router.get("/deploy/:projectId", auth_1.authenticateToken, project_1.getDeploymentsByProjectID);
router.post("/", auth_1.authenticateToken, validateProjectDetails(), project_1.createProject);
router.put("/:projectId", auth_1.authenticateToken, project_1.updateProject);
router.put("/env/:projectId", auth_1.authenticateToken, project_1.updateEnvFields);
router.post("/deploy/:projectId", auth_1.authenticateToken, project_1.deployProject);
router.put("/deploy/:deployId", project_1.changeStatus);
router.get("/deploy/logs/:deployId", auth_1.authenticateToken, project_1.getLogs);
router.get("/github/repos", auth_1.authenticateToken, project_1.getRepos);
router.get("/github/branches/:projectId", auth_1.authenticateToken, project_1.getBranches);
exports.default = router;
