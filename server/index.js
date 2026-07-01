import express from 'express';
import route from "./routes/routes.js"

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', route)

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
