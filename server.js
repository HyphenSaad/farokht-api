import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('saad')
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

// StartServer()