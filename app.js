const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

require("dotenv").config();

//express
const app = express();

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

//routes

app.use("/api", userRoutes);

//

const port = process.env.PORT || 8000;

app.listen(port);
