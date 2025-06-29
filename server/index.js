import express from 'express';
import route from "./routes/routes.js"
import { initialize } from "./Controller/ContentController.js";
import cors from "cors"




const app = express();
const PORT = 3000;


// app.use(cors({
//     origin:"http://localhost:5173",
//     methods: 'GET,POST', // Allow only these methods
//     allowedHeaders: ['Content-Type', 'Authorization'] 
// }))
// Middleware for error handling and validation
app.use((req, res, next) => {
  // Enable CORS if needed
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


// await initialize(); // Preload cached pages
app.use('/', route)

app.listen(PORT, async () => {
//   await initialize();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
