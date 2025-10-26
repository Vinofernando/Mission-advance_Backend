import express from 'express';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Berhasil mengakses data rahasia!",
    user: req.user
  });
});

export default router;
