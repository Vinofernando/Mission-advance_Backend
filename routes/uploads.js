import express from "express"

const router = express.Router()

router.post('/uploads', (req, res) => {
    const file = req.file;
    if (!file){
        res.status(400)
        throw new Error("Tidak ada file yang diinput")
    }

    const imageFileName = file.filename
    const pathImageFile = `/uploads/${imageFileName}`

    res.status(200).json({
        pesan: "Image berhasil diuploads",
        image: pathImageFile
    })
})

export default router