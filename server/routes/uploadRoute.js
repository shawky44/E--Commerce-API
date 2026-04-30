import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router.post("/", upload.single("product"), (req, res) => {
  try {
    res.json({
      success: true,
      imageURL: `http://localhost:${process.env.PORT}/images/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;