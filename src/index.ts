import express from 'express'
import * as dotenv from 'dotenv';
dotenv.config();


const port = process.env.PORT || 8080;

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.send('Hotel Management System API is running!')
})

app.listen(port, () => {
  console.log(`Hotel Management System API is running on port ${port}`)
})
