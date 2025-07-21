import express from 'express'   
const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.send('Hotel Management System API is running!')
})

app.listen(3000, () => {
  console.log('Hotel Management System API is running on port 3000')
})
