const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const authRoutes = require("./routes/userRoutes");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);

mongoose.connect(process.env.MONGODB_URI, () =>
  console.log("Connected to database sucessfully")
);

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
