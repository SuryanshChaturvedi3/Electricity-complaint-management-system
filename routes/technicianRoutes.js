const express = require("express");
const router = express.Router(); 
const  Complaint  = require("../models/complaint");
const { authenticateJWT,generateToken } = require("../jwt");
const Technician = require("../models/technician");

/*---------Technician Login Route---------*/
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
       
       
        const technician = await Technician.findOne({ email });
        if (!technician) {
            return res.status(400).json({ message: "Invalid Technician ID" });
        }
        const isMatch = await technician.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const payload = {
            message: "Login successful",
            email: technician.email,
            technicianId: technician._id,
            role: technician.role,
            name: technician.name,
        };
        const token = generateToken(payload);
        console.log("Generated Token:", token);
        res.cookie("token", token, { httpOnly: true,sameSite: 'Lax' });
        res.status(200).json({ message: "Login successful", token, name: technician.name, role: technician.role });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

/*----------Get Assigned Complaints Route---------*/
router.get("/complaints", authenticateJWT, async (req, res) => {
    try {
        if(req.user.role !== "technician"){
            return res.status(403).json({ message: "Only Technicians can perform this action" });
        }
        const complaints = await Complaint.find({ technicianId: req.user.technicianId })

        console.log("JWT technicianId:", req.user.technicianId);

const all = await Complaint.find({});
console.log("ALL COMPLAINTS:", all.map(c => c.technicianId));

        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

/*-----------Get Single Complaint Route---------*/
// 🔥 GET SINGLE COMPLAINT DETAIL
router.get("/complaints/:id", authenticateJWT, async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error("Single complaint fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});





/*----------Resolve Complaint Route---------*/
router.put("/complaints/:id/resolve", authenticateJWT, async (req, res) => {
    try {
        if(req.user.role !== "technician"){
            return res.status(403).json({ message: "Only Technicians can perform this action" });
        }
        const complaint = await Complaint.findById(req.params.id);
        complaint.approvalStatus = "resolved";
        complaint.resolvedAt = new Date();
        await complaint.save();
        res.status(200).json({ message: "Complaint resolved successfully", complaint });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
module.exports = router;