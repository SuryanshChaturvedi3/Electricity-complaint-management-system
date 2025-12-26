// seedtechnician.js
const mongoose = require("mongoose");
const Technician = require("./models/technician");

async function seedTechnician() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ElectroDB");
  console.log("DB Connected");

  const existing = await Technician.findOne({
    technicianId: "TECH001",
  });

  if (existing) {
    console.log("Technician already exists");
    process.exit(0);
  }

  const tech = new Technician({
    name: "John Doe",
    email: "t@gmail.com",
    password: "Tech@1234",
    role: "technician",
    mobileNumber: "9123456780",
    activeStatus: true,
  });

  await tech.save();
  console.log("Technician created successfully");
  console.log(tech);

  process.exit(0);
}

seedTechnician();