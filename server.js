// index.js
import express from 'express';
import loginRoutes from "./routes/login.js"
import registerRoutes from "./routes/register.js"
import { verifyToken } from './middleware/authentication.js';
import profileRoutes from './routes/profile.js'
import verifyRoutes from './routes/verify.js'
import  movieRoutes from './routes/movie.js'
import uploadsRouter from './routes/uploads.js'
import { upload } from './utilis/uploadFileHandler.js';


const app = express();
const PORT = 3000;

app.use(express.json()); // untuk parsing JSON body

app.use(express.static('./public'))
app.use('/', loginRoutes)
app.use('/', registerRoutes)
app.use('/user', verifyToken, profileRoutes)
app.use('/api', verifyRoutes)
app.use('/', movieRoutes)
app.use('/',verifyToken, upload.single('image'), uploadsRouter)


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
