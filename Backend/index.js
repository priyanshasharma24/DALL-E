const express = require('express');
const cors = require('cors')
require('dotenv').config();

const postRoutes = require("./routes/postRoutes");
const dalleRoutes = require("./routes/dalleRoutes");
const {connectDB} = require('./mongodb/connect');

const app = express();

app.use(cors({
  // origin: 'http://localhost:3000', // replace with your frontend's URL
    origin: '*', // replace with your frontend's URL

  credentials: true, // allow credentials (if needed)
}));

app.use(express.json());

// Define Routes
app.use('/api/v1/post',postRoutes)
app.use('/api/v1/dalle',dalleRoutes)


app.get("/", async (req, res) => {
    res.json("hello from DALL-E");
});


const main = async() => {
    try {
        await connectDB(process.env.MONGODB_URL)
        app.listen(5000, () => {
          console.log("listen on 5000.");
        });
    } catch (error) {
      console.log(error)
    }
  }
  
  main()
