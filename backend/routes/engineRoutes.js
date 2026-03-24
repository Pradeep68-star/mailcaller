import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import engineScan from "../services/engineScanService.js";

const router = express.Router();

/**
 * POST /api/engine/scan
 */
router.post("/scan", authMiddleware, async (req, res) => {
  try {
    await engineScan(req.user._id);

    res.json({
      success: true,
      message: "Scan completed",
    });
  } catch (err) {
    console.error("Scan error:", err);

    res.status(500).json({
      success: false,
      message: "Scan failed",
    });
  }
});

export default router;