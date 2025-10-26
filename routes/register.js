import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = uuidv4()

    await pool.query(`
        INSERT INTO users (fullname, username, email, password, verify_token, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [fullname, username, email, hashed, verifyToken, false]);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const link = `http://localhost:5000/api/verify/${verifyToken}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `verifikasi email anda`,
      html: `<p>Klik link berikut untuk verifikasi akun:</p><a href="${link}">${link}</a>`
    })

    res.json({ pesan: 'Registrasi berhasil, cek email untuk verifikasi akun' })

  } catch(error){
    console.error(error)
    res.status(500).json({ pesan: 'Terjadi kesalahan server' })
  }
});


export default router