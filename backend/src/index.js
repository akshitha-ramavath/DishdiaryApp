import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.set('strictQuery', false); // Prepare for Mongoose 7 changes

mongoose.connect(
  "mongodb+srv://AkshithaRamavath:DD12345@dddb.s08bn.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("DB connected...");
  }).catch(err => {
    console.error("DB connection error:", err);
  });



app.listen(5000, () => console.log("Server started on port 5000"));
