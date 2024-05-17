import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import Thought from "./models/Thoughts"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//The port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Route handler
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

//Get thoughts, descending by created and limit to 20 thoughts
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
  
  try {
    res.status(201).json({
      sucess: true,
      response: thoughts,
      message: "Happy thoughts retrieved"
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Could not retrieve any Happy thoughts"
    })
  }
})

//Post a thought endpoint
app.post("/thoughts", async (req, res) => {
  const { message, hearts, createdAt } = req.body //Retrieve the information sent by user to our API endpoint

  //Use the mongoose model to create the database entry
  const thought = new Thought({ message, hearts, createdAt }) 

  try {
    const newThought = await thought.save()
    res.status(201).json({
      sucess: true,
      response: newThought,
      message: "Thought posted"
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Could not post thought"
    })
  }
})


//Post request to like a thought
app.post("/thoughts")


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
