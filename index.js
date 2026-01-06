require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const express = require("express");
const StudentRoutes = require("./routes/studentRoutes");
const authorityRoutes = require("./routes/authorityRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const { authenticateJWT } = require("./jwt");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors"); // Import cors module for connecting frontend and backend
const PORT = process.env.PORT || 3000;

/*----------Database Connection--------------*/
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ElectroDB")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.log(err);
  });

/*-----------Middleware Setup--------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*----------view engine setup--------------**/
app.set("views", path.join(__dirname, "views"));

/*----------CORS setup for frontend-backend connection--------------*/
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    // 👈 FRONTEND PORT
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to ElectroDB Server");
});

/*--------------routes setup--------------*/
app.use("/student", StudentRoutes);
app.use("/auth", authorityRoutes);
app.use("/technician", technicianRoutes);

/*---------------Server Connection---------------*/
app.listen(PORT, () => {
  console.log(`Server Started at: ${PORT}`);
});
