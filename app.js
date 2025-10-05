const express = require("express");
const notifyRouter = require("./routes/notify");

const app = express();
app.use(express.json());

app.use("/api", notifyRouter);

app.listen(8000, () => {
  console.log("🚀 notifyiqq running at http://localhost:8000");
});