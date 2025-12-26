// seedAuthority.js
const mongoose = require("mongoose");
const Authority = require("./models/authority");
//require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/ElectroDB")
  .then(async () => {
    console.log("DB Connected");

    const existing = await Authority.findOne({ email: "admin@college.com" });
    if (existing) {
      console.log("Authority already exists");
      process.exit();
    }

    const auth = new Authority({
      name: "College Admin",
      email: "admin@college.com",
      password: "Admin@123", // pre-save hook hash karega
      role: "authority",
        mobileNumber: "9876543210",
        authorityId: "AUTH001"

    });

    await auth.save();
    console.log("Authority created successfully");
    process.exit();
  })
  .catch((err) => console.log(err));
