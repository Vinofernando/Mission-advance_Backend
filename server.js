// index.js
import express from 'express';
import loginRoutes from "./routes/login.js"
import registerRoutes from "./routes/register.js"
import { verifyToken } from './middleware/authentication.js';
import profileRoutes from './routes/profile.js'
import verifyRoutes from './routes/verify.js'
import  movieRoutes from './routes/movie.js'


const app = express();
const PORT = 3000;

app.use(express.json()); // untuk parsing JSON body

app.use('/', loginRoutes)
app.use('/', registerRoutes)
app.use('/user', verifyToken, profileRoutes)
app.use('/api', verifyRoutes)
app.use('/', movieRoutes)


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
