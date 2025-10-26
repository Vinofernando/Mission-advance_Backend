import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/verify/:token', async (req, res) => {
  const { token } = req.params

  const result = await pool.query('SELECT * FROM users WHERE verify_token = $1', [token])

  if (result.rowCount === 0) {
    return res.status(400).json({ pesan: 'Token tidak valid' })
  }

  // Tandai user sebagai verified
  await pool.query(`
    UPDATE users SET is_verified = true, verify_token = NULL
    WHERE verify_token = $1
  `, [token])

  res.json({ pesan: 'Akun berhasil diverifikasi, silakan login' })
})

export default router