import express from "express"
import pool from '../db.js'

const router = express.Router()

router.get('/movie', async (req, res) => {
  try {
    const { film, genre } = req.query

    // Base query: sudah termasuk join
    let query = `
      SELECT 
        m.movie_id,
        m.movie_title,
        g.genre_film
      FROM movie m
      JOIN movie_genre mg ON m.movie_id = mg.movie_id
      JOIN genre g ON mg.genre_id = g.genre_id
    `
    
    const values = []
    const conditions = []

    // Jika ada query filter film
    if (film) {
      values.push(`%${film}%`)
      conditions.push(`m.movie_title ILIKE $${values.length}`)
    }

    if (genre) {
      values.push(`%${genre}%`)
      conditions.push(`g.genre_film ILIKE $${values.length}`)
    }

    // Tambahkan kondisi (WHERE) jika ada
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ')
    }

    // Tambahkan pengurutan biar hasil rapi
    query += ` ORDER BY m.movie_title ASC`

    const result = await pool.query(query, values)
    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ pesan: "Terjadi kesalahan server" })
  }
})

export default router
