require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors"); // 1. Import sabse upar
const path = require("path");
const cookieParser = require("cookie-parser");

const StudentRoutes = require("./routes/studentRoutes");
const authorityRoutes = require("./routes/authorityRoutes");
const technicianRoutes = require("./routes/technicianRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/*---------- 2. CORS Setup (MUST BE FIRST MIDDLEWARE) --------------*/
app.use(
  cors({
    // Yahan '*' bilkul nahi hona chahiye
    origin: ["https://electricity-complaint-management-system-1.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

/*----------- 3. Other Middlewares --------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*---------- 4. Database Connection --------------*/
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ElectroDB")
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((err) => console.log("❌ Database Connection Failed", err));

/*-------------- 5. Routes Setup --------------*/
app.get("/", (req, res) => {
  res.send("Welcome to ElectroDB Server");
});

app.use("/student", StudentRoutes);
app.use("/auth", authorityRoutes);
app.use("/technician", technicianRoutes);

/*--------------- 6. Server Connection ---------------*/
app.listen(PORT, () => {
  console.log(`🔥 Server Started at: ${PORT}`);
});