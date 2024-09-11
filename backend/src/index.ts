import express from "express";
const app = express();
import userRouter from "./routes/user";
import workerRouter from "./routes/worker";
import cors from "cors";
import "dotenv/config";

app.use(cors());
app.use(express.json());
app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

//! postgres + prima ==> ORM (postgresql://neondb_owner:AKJCl2YGra5T@ep-shrill-glitter-a5dd7u9d.us-east-2.aws.neon.tech/neondb?sslmode=require)

app.get("/", (req, res) => {
  res.send("Server is running and up !!!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
