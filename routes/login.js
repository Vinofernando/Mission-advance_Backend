import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();

const JWT_SECRET = 'rahasia'

router.post("/login", async (req, res) => {
    try{
        const { email, password} = req.body
        const userResult = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `,
            [email]
        )

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Email tidak ditemukan" });
        }

        const user = userResult.rows[0]
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(400).json({ message: "Password salah" });
        }

        if (!user.is_verified) {
            return res.status(403).json({ pesan: 'Akun belum diverifikasi. Cek email Anda.' })
        }

        const token = jwt.sign(
            {id: user.user_id, email: user.email},
            JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id: user.user_id,
                fullname: user.fullname,
                username: user.username,
                email: user.email
            }
        });

        } catch(error){
            console.error(error.message)
            res.status(500).json({message: "Server error"})
        }
})

export default router