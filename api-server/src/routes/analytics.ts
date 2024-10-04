import express from "express";
import { authenticateToken } from "../middleware/auth";
import { getVisitTrends, getGeographicalDistribution, updateCountryInfo } from "../controllers/analytics";

const router = express.Router();

router.get("/visitTrend/:projectName", authenticateToken, getVisitTrends);
router.get("/geo/:projectName", authenticateToken, getGeographicalDistribution);
router.patch("/updateCountry/:id", authenticateToken, updateCountryInfo);

export default router;