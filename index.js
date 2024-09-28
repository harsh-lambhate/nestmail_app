const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const {MONGODB_URI}=require("./config/mongodbCredentials");
const app = express();
require("./mail/transporter");

app.use(express.json());

app.use("/users", userRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((success) => console.log("Mongodb connected successfully..."))
  .catch((error) => console.log(error));

const PORT = 4000;

app.listen(PORT, () => console.log(`App is running on ${PORT}...`));
