import jwt from 'jsonwebtoken'
const JWT_SECRET = 'rahasia'

export function verifyToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error){
        res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
}