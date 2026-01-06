const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateJWT, generateToken } = require("../jwt");
const Authority = require("../models/authority");
const Complaint = require("../models/complaint");
const authority = require("../models/authority");
const Technician = require("../models/technician");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");



/*---------Authority Login Route---------*/
router.post("/login", async (req, res) => {
  try {
    const { authorityId, password } = req.body;
    console.log("login hit");

    console.log(req.body);

    const authority = await Authority.findOne({ authorityId });
    if (!authority) {
      return res.status(400).json({ message: "Invalid Authority ID" });
    }

    const isMatch = await authority.comparePassword(
      password,
      authority.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      message: "Login successful",
      id: authority._id,
      role: "authority",
      name: authority.name,
    };
    const token = generateToken(payload);
    console.log("Generated Token:", token);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token, name: authority.name, role: authority.role });
  } catch (error) {
    res.status(500).json({ message: "Server Blocked", error: error.message });
  }
});

/*----------Get All Complaints Route---------*/
router.get("/complaints", authenticateJWT, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    console.log(complaints);
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/*----------Get Complaint by ID Route---------*/

router.get("/complaints/:id", authenticateJWT, async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  res.json({ complaint });
});

/*----------Approve or Reject Complaint Route---------*/
router.put("/complaints/:id/approve", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "authority") {
      return res
        .status(403)
        .json({ message: "Only Authorities can perform this action" });
    }
    const complaint = await Complaint.findById(req.params.id);
    console.log(complaint);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 3️⃣ Allow only pending → approved
    if (complaint.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Only pending complaints can be approved",
      });
    }

    // 4️⃣ Update status + approvedBy
    complaint.approvalStatus = "approved";
    //console.log(complaint.approvalStatus);
    complaint.approvedBy = req.user.authorityId;

    await complaint.save();
    console.log(" Complaint approved");
    res.status(200).json({
      message: `Complaint approved successfully`,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/*-----------All Authority Technicians Route---------*/
router.get("/technicians", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "authority") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const technicians = await Technician.find().select("_id name email");

    res.json({ technicians });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*----------Assign Technician to Complaint Route---------*/
router.put("/complaints/:id/assign", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "authority") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { technicianId } = req.body;
    const technician = await Technician.findById(technicianId);

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.approvalStatus = "assigned";
    complaint.technicianId = technician._id;
    complaint.technicianname = technician.name;

    await complaint.save();

    res.json({ message: "Technician assigned", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
